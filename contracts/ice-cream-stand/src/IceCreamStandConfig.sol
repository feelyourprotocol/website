// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @dev Base mainnet addresses for Ice Cream Week — keep in sync with `src/ice-cream/constants.ts`.
library IceCreamStandConfig {
    address internal constant FYP_TOKEN = 0x8eAE800Ff67778057941792aCdBAB29904962bA3;
    address internal constant FYP_SPECIAL_ACTIONS_WALLET = 0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202;
    string internal constant METADATA_BASE_URI = "https://feelyourprotocol.org/ice-cream/metadata/";
}
