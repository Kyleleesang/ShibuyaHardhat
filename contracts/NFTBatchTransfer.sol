pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTBatchTransfer {

    //Test approval for a batch transfer to a single address with approval
    function TestbatchTransfer(address _nftContract, address _to, uint256[] memory _tokenIds) external {
        IERC721 nftContract = IERC721(_nftContract);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            nftContract.safeTransferFrom(msg.sender, _to, _tokenIds[i]);
        }
    }

    //test approval for a batch transfer to multiple addresses with approval
    function TestbatchTransferToMultipleWallets(address _nftContract, address[] memory _tos, uint256[] memory _tokenIds) external {
        IERC721 nftContract = IERC721(_nftContract);
        require(_tos.length == _tokenIds.length, "Invalid arguments");
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            nftContract.safeTransferFrom(msg.sender, _tos[i], _tokenIds[i]);
        }
    }


    event BatchTransferToSingle(
        address indexed contractAddress,
        address indexed to,
        uint256 amount
    );

    event BatchTransferToMultiple(
        address indexed contractAddress,
        uint256 amount
    );

    // solhint-disable-next-line no-empty-blocks
    constructor() {}

    modifier noZero() {
        require(msg.sender != address(0), "Invalid caller");
        _;
    }

    /// @notice Transfer multiple tokens to the same wallet using the ERC721.transferFrom method
    /// @notice If you don't know what that means, use the `safeBatchTransferToSingleWallet` method instead
    /// @param erc721Contract the address of the nft contract
    /// @param to the address that will receive the nfts
    /// @param tokenIds the list of tokens that will be transferred
    function batchTransferToSingleWallet(
        IERC721 erc721Contract,
        address to,
        uint256[] calldata tokenIds
    ) external noZero {
        uint256 length = tokenIds.length;
        for (uint256 i; i < length; ) {
            uint256 tokenId = tokenIds[i];
            address owner = erc721Contract.ownerOf(tokenId);
            require(msg.sender == owner, "Not owner of token");
            erc721Contract.transferFrom(owner, to, tokenId);
            unchecked {
                ++i;
            }
        }
        emit BatchTransferToSingle(address(erc721Contract), to, length);
    }

    /// @notice transfer multiple tokens to the same wallet using the `ERC721.safeTransferFrom` method
    /// @param erc721Contract the address of the nft contract
    /// @param to the address that will receive the nfts
    /// @param tokenIds the list of tokens that will be transferred
    function safeBatchTransferToSingleWallet(
        IERC721 erc721Contract,
        address to,
        uint256[] calldata tokenIds
    ) external noZero {
        uint256 length = tokenIds.length;
        for (uint256 i; i < length; ) {
            uint256 tokenId = tokenIds[i];
            address owner = erc721Contract.ownerOf(tokenId);
            require(msg.sender == owner, "Not owner of token");
            erc721Contract.safeTransferFrom(owner, to, tokenId);
            unchecked {
                ++i;
            }
        }
        emit BatchTransferToSingle(address(erc721Contract), to, length);
    }

    /// @notice Transfer multiple tokens to multiple wallets using the ERC721.transferFrom method
    /// @notice If you don't know what that means, use the `safeBatchTransferToMultipleWallets` method instead
    /// @notice The tokens in `tokenIds` will be transferred to the addresses in the same position in `tos`
    /// @notice E.g.: if tos = [0x..1, 0x..2, 0x..3] and tokenIds = [1, 2, 3], then:
    ///         0x..1 will receive token 1;
    ///         0x..2 will receive token 2;
    //          0x..3 will receive token 3;
    /// @param erc721Contract the address of the nft contract
    /// @param tos the list of addresses that will receive the nfts
    /// @param tokenIds the list of tokens that will be transferred
    function batchTransferToMultipleWallets(
        IERC721 erc721Contract,
        address[] calldata tos,
        uint256[] calldata tokenIds
    ) external noZero {
        uint256 length = tokenIds.length;
        require(tos.length == length, "Invalid arguments");

        for (uint256 i; i < length; ) {
            uint256 tokenId = tokenIds[i];
            address owner = erc721Contract.ownerOf(tokenId);
            address to = tos[i];
            require(msg.sender == owner, "Not owner of token");
            erc721Contract.transferFrom(owner, to, tokenId);
            unchecked {
                ++i;
            }
        }
        emit BatchTransferToMultiple(address(erc721Contract), length);
    }

    /// @notice Transfer multiple tokens to multiple wallets using the ERC721.safeTransferFrom method
    /// @notice The tokens in `tokenIds` will be transferred to the addresses in the same position in `tos`
    /// @notice E.g.: if tos = [0x..1, 0x..2, 0x..3] and tokenIds = [1, 2, 3], then:
    ///         0x..1 will receive token 1;
    ///         0x..2 will receive token 2;
    //          0x..3 will receive token 3;
    /// @param erc721Contract the address of the nft contract
    /// @param tos the list of addresses that will receive the nfts
    /// @param tokenIds the list of tokens that will be transferred
    function safeBatchTransferToMultipleWallets(
        IERC721 erc721Contract,
        address[] calldata tos,
        uint256[] calldata tokenIds
    ) external noZero {
        uint256 length = tokenIds.length;
        require(tos.length == length, "Invalid arguments");

        for (uint256 i; i < length; ) {
            uint256 tokenId = tokenIds[i];
            address owner = erc721Contract.ownerOf(tokenId);
            address to = tos[i];
            require(msg.sender == owner, "Not owner of token");
            erc721Contract.safeTransferFrom(owner, to, tokenId);
            unchecked {
                ++i;
            }
        }

        emit BatchTransferToMultiple(address(erc721Contract), length);
    }

    
}