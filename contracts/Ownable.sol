// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Ownable{

    address public owner;
    mapping(address => bool) public isAdmin;
    event owner_change(address _newOwner);
    event admin_add(address _newAdmin);

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "OnlyOwner: user not owner");
        _;
    }
    
    modifier onlyAdmin() {
        require(isAdmin[msg.sender] == true, "OnlyAdmin: user not admin");
        _;
    }

    function transferOwnerShip(address _newOwner) public virtual onlyOwner {
        require(_newOwner != address(0) , "Ownable: newOwner is the zero address");
        emit owner_change(_newOwner);
        owner = _newOwner;
    }

    function addAdmin(address _newAdmin) public virtual onlyOwner {
        require(isAdmin[_newAdmin] == false, "addAdmin: Already admin");
        require(_newAdmin != address(0) , "addAdmin: newAdmin is the zero address");
        emit admin_add(_newAdmin);
        isAdmin[_newAdmin] = true;
    }

    function removeAdmin(address wallet) public onlyOwner {
        require(isAdmin[wallet] == true, "removeAdmin: User not admin");
        require(wallet != msg.sender, "removeAdmin: Cannot remove yourself");
        isAdmin[wallet] = false;
    }
    
}