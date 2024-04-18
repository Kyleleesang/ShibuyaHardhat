// SPDX-License-Identifier: MIT

pragma solidity =0.8.19;

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract WrabDistributorV2 is Ownable {
    using SafeERC20 for IERC20;

    address public tokenAddress;
    address private signerAddress;
    bool public claimOpen;

    mapping(bytes32 => bool) private claimedSignatures;
    mapping(address => uint256) public userClaimedTokens;

    event Claimed(address account, uint256 amount);

    constructor(address _tokenAddress, address _signerAddress) {
        //require address is not zero
        require(_tokenAddress != address(0), "Invalid token address");
        require(_signerAddress != address(0), "Invalid signer address");
        tokenAddress = _tokenAddress;
        signerAddress = _signerAddress;
    }

    function claim(
        uint256 amount,
        uint256 createdAtMs,
        bytes memory signature
    ) public virtual {
        address userAddress = msg.sender;
        bytes32 signatureHash = keccak256(signature);
        require(claimOpen, "Claim is not active.");
        require(
            verifySignature(userAddress, amount, createdAtMs, signature),
            "Invalid Signature."
        );
        require(!claimedSignatures[signatureHash], "Already claimed.");

        uint256 claimedAmount = userClaimedTokens[userAddress];
        userClaimedTokens[userAddress] = amount + claimedAmount;
        claimedSignatures[signatureHash] = true;
        IERC20(tokenAddress).safeTransfer(userAddress, amount * 10**18);

        emit Claimed(userAddress, amount);
    }

    function verifySignature(
        address userAddress,
        uint256 amount,
        uint256 createdAtMs,
        bytes memory signature
    ) private view returns (bool) {
        bytes32 messageHash = getMessageHash(userAddress, amount, createdAtMs);
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(
            messageHash
        );

        return ECDSA.recover(ethSignedMessageHash, signature) == signerAddress;
    }

    function getMessageHash(
        address userAddress,
        uint256 wrabAmount,
        uint256 createdAtMs
    ) private pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(userAddress, wrabAmount, createdAtMs));
    }

    function hasClaimedSignature(bytes memory signature)
        public
        view
        returns (bool)
    {
        bytes32 signatureHash = keccak256(signature);

        return claimedSignatures[signatureHash];
    }

    // Owner only methods
    function setClaimOpen(bool claimOpen_) external onlyOwner {
        claimOpen = claimOpen_;
    }

    function setSigner(address signerAddress_) external onlyOwner {
        signerAddress = signerAddress_;
    }

    /**
     * @dev Withdraw excess tokens left in the contract
     */
    function withdraw(uint256 amount) external onlyOwner {
        IERC20(tokenAddress).safeTransfer(msg.sender, amount * 10**18);
    }
}
