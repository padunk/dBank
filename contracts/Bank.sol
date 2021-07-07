//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Token.sol';
import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Bank {
    struct Account {
        uint balance;
        uint timestamp;
    }

    Token private token;
    mapping (address=>Account) accounts;

    constructor (Token _token) {
        token = _token;
    }

    function deposit(address _address, uint _amount) public {
        require(msg.sender == _address);

        uint newBalance = accounts[_address].balance + _amount;
        Account memory newAccount =  Account(newBalance, block.timestamp);
        accounts[_address] = newAccount;
    }

    function withdraw(address _address, uint _amount) public {
        require(msg.sender == _address);
        
        uint newBalance = accounts[_address].balance - _amount;
        Account memory newAccount =  Account(newBalance, block.timestamp);
        accounts[_address] = newAccount;
    }
}