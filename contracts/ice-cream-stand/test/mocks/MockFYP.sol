// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Test-only FYP stand-in — mint tokens freely in unit tests.
contract MockFYP is ERC20 {
    constructor() ERC20("Feel Your Protocol", "FYP") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
