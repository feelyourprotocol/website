// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {IceCreamStand} from "../src/IceCreamStand.sol";
import {IceCreamStandConfig} from "../src/IceCreamStandConfig.sol";

/// @dev Deploy: `forge script script/DeployIceCreamStand.s.sol --rpc-url base --broadcast`
contract DeployIceCreamStand is Script {
    function run() external {
        uint256[] memory allowedTokenIds = new uint256[](8);
        allowedTokenIds[0] = 2;
        allowedTokenIds[1] = 3;
        allowedTokenIds[2] = 9;
        allowedTokenIds[3] = 10;
        allowedTokenIds[4] = 13;
        allowedTokenIds[5] = 14;
        allowedTokenIds[6] = 16;
        allowedTokenIds[7] = 18;

        vm.startBroadcast();

        new IceCreamStand(
            IceCreamStandConfig.FYP_TOKEN,
            IceCreamStandConfig.FYP_SPECIAL_ACTIONS_WALLET,
            IceCreamStandConfig.METADATA_BASE_URI,
            msg.sender,
            allowedTokenIds
        );

        vm.stopBroadcast();
    }
}
