// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {IceCreamStand} from "../src/IceCreamStand.sol";
import {MockFYP} from "./mocks/MockFYP.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract IceCreamStandTest is Test {
    IceCreamStand internal stand;
    MockFYP internal fyp;

    address internal treasury = makeAddr("treasury");
    address internal buyer = makeAddr("buyer");
    address internal buyer2 = makeAddr("buyer2");

    uint256 internal constant DOGE = 3;
    uint256 internal constant CLOWN = 9;

    uint256[] internal allowedIds;

    function setUp() public {
        allowedIds.push(2);
        allowedIds.push(DOGE);
        allowedIds.push(CLOWN);
        allowedIds.push(10);
        allowedIds.push(13);
        allowedIds.push(14);
        allowedIds.push(16);
        allowedIds.push(18);

        fyp = new MockFYP();
        stand = new IceCreamStand(
            address(fyp),
            treasury,
            "https://feelyourprotocol.org/ice-cream/metadata/",
            address(this),
            allowedIds
        );

        fyp.mint(buyer, 100 ether);
        fyp.mint(buyer2, 100 ether);
    }

    function _approveAndBuy(address who, uint256 tokenId) internal {
        vm.startPrank(who);
        fyp.approve(address(stand), stand.SCOOP_PRICE());
        stand.buyScoop(tokenId);
        vm.stopPrank();
    }

    function test_buyScoop_mintsAndPaysTreasury() public {
        _approveAndBuy(buyer, DOGE);

        assertEq(stand.balanceOf(buyer, DOGE), 1);
        assertTrue(stand.hasMinted(buyer, DOGE));
        assertEq(fyp.balanceOf(treasury), stand.SCOOP_PRICE());
        assertEq(fyp.balanceOf(buyer), 100 ether - stand.SCOOP_PRICE());
    }

    function test_buyScoop_secondFlavorSameWallet() public {
        _approveAndBuy(buyer, DOGE);
        _approveAndBuy(buyer, CLOWN);

        assertEq(stand.balanceOf(buyer, DOGE), 1);
        assertEq(stand.balanceOf(buyer, CLOWN), 1);
        assertEq(fyp.balanceOf(treasury), stand.SCOOP_PRICE() * 2);
    }

    function test_buyScoop_revertsWhenSameFlavorTwice() public {
        _approveAndBuy(buyer, DOGE);

        vm.startPrank(buyer);
        fyp.approve(address(stand), stand.SCOOP_PRICE());
        vm.expectRevert(abi.encodeWithSelector(IceCreamStand.AlreadyScooped.selector, buyer, DOGE));
        stand.buyScoop(DOGE);
        vm.stopPrank();
    }

    function test_buyScoop_revertsUnknownTokenId() public {
        vm.startPrank(buyer);
        fyp.approve(address(stand), stand.SCOOP_PRICE());
        vm.expectRevert(abi.encodeWithSelector(IceCreamStand.UnknownFlavor.selector, 99));
        stand.buyScoop(99);
        vm.stopPrank();
    }

    function test_buyScoop_revertsWithoutApproval() public {
        vm.startPrank(buyer);
        vm.expectRevert();
        stand.buyScoop(DOGE);
        vm.stopPrank();
    }

    function test_buyScoop_revertsInsufficientBalance() public {
        address brokeBuyer = makeAddr("broke");
        fyp.mint(brokeBuyer, 5 ether);

        vm.startPrank(brokeBuyer);
        fyp.approve(address(stand), stand.SCOOP_PRICE());
        vm.expectRevert();
        stand.buyScoop(DOGE);
        vm.stopPrank();
    }

    function test_transfer_revertsSoulbound() public {
        _approveAndBuy(buyer, DOGE);

        vm.startPrank(buyer);
        vm.expectRevert(IceCreamStand.SoulboundTransferNotAllowed.selector);
        IERC1155(address(stand)).safeTransferFrom(buyer, buyer2, DOGE, 1, "");
        vm.stopPrank();
    }

    function test_uri_returnsDecimalMetadataPath() public view {
        assertEq(stand.uri(DOGE), "https://feelyourprotocol.org/ice-cream/metadata/3.json");
        assertEq(stand.uri(18), "https://feelyourprotocol.org/ice-cream/metadata/18.json");
    }

    function test_setMetadataBaseURI_onlyOwner() public {
        stand.setMetadataBaseURI("https://example.com/meta/");
        assertEq(stand.uri(DOGE), "https://example.com/meta/3.json");

        vm.prank(buyer);
        vm.expectRevert();
        stand.setMetadataBaseURI("https://evil.example/");
    }
}
