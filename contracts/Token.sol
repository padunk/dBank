// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Token is ERC20, Ownable {
  address public minter;

  event MinterChanged(address indexed _from, address _to);

  constructor () payable ERC20("Decentralized Bank Currency", "DCB") {
    minter = msg.sender;
  }

  function passMinterRole(address _dbank) public onlyOwner returns(bool) {
    minter = _dbank;
    emit MinterChanged(msg.sender, _dbank);
    return true;
  }

  function mint(address _account, uint _amount) public onlyOwner {
    _mint(_account, _amount);
  }
}