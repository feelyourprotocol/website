// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title IceCreamStand
/// @notice Ice Cream Week on Base — pay FYP, receive a soulbound ERC-1155 receipt (one per flavor per wallet).
contract IceCreamStand is ERC1155, Ownable {
    using SafeERC20 for IERC20;

    /// @dev 10 FYP with 18 decimals.
    uint256 public constant SCOOP_PRICE = 10 ether;

    IERC20 public immutable fyp;
    /// @notice FYP from scoops — booked separately from the main protocol treasury.
    address public immutable fypSpecialActionsWallet;

    string private _metadataBaseURI;

    mapping(uint256 tokenId => bool allowed) public allowedToken;
    mapping(address buyer => mapping(uint256 tokenId => bool minted)) public hasMinted;

    error SoulboundTransferNotAllowed();
    error UnknownFlavor(uint256 tokenId);
    error AlreadyScooped(address buyer, uint256 tokenId);

    event ScoopPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event MetadataBaseURIUpdated(string newBaseURI);

    /// @param metadataBaseURI Prefix for per-token JSON; `uri(tokenId)` → `{metadataBaseURI}{tokenId}.json`.
    /// @param fypSpecialActionsWallet_ Receives 10 FYP per scoop (FYP Special Actions ledger).
    constructor(
        address fypToken,
        address fypSpecialActionsWallet_,
        string memory metadataBaseURI,
        address initialOwner,
        uint256[] memory allowedTokenIds
    ) ERC1155("") Ownable(initialOwner) {
        require(fypToken != address(0), "fyp=0");
        require(fypSpecialActionsWallet_ != address(0), "wallet=0");

        fyp = IERC20(fypToken);
        fypSpecialActionsWallet = fypSpecialActionsWallet_;
        _metadataBaseURI = metadataBaseURI;

        for (uint256 i = 0; i < allowedTokenIds.length; ++i) {
            allowedToken[allowedTokenIds[i]] = true;
        }
    }

    /// @notice Pay 10 FYP and mint one soulbound receipt for `tokenId`.
    /// @dev One mint per (wallet, tokenId). Collect up to all allowed flavors.
    function buyScoop(uint256 tokenId) external {
        if (!allowedToken[tokenId]) revert UnknownFlavor(tokenId);
        if (hasMinted[msg.sender][tokenId]) revert AlreadyScooped(msg.sender, tokenId);

        hasMinted[msg.sender][tokenId] = true;
        fyp.safeTransferFrom(msg.sender, fypSpecialActionsWallet, SCOOP_PRICE);
        _mint(msg.sender, tokenId, 1, "");

        emit ScoopPurchased(msg.sender, tokenId, SCOOP_PRICE);
    }

    /// @inheritdoc ERC1155
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string.concat(_metadataBaseURI, Strings.toString(tokenId), ".json");
    }

    /// @notice Update metadata prefix (e.g. after moving JSON hosting).
    function setMetadataBaseURI(string calldata newBaseURI) external onlyOwner {
        _metadataBaseURI = newBaseURI;
        emit MetadataBaseURIUpdated(newBaseURI);
    }

    /// @dev Soulbound: mint allowed, transfers between wallets blocked.
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {
        if (from != address(0) && to != address(0)) {
            revert SoulboundTransferNotAllowed();
        }
        super._update(from, to, ids, values);
    }
}
