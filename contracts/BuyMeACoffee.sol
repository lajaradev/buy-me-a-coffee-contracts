// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Ownable.sol";

contract BuyMeACoffee is Ownable {

    uint256 public ClientCount = 0;
    uint256 public AmountTotal = 0;

    Client[] public Coffees;

    struct Client {
        uint256 id;
        string name;
        string description;
        string urlImg;
        uint256 tipAmount;
        address payable wallet;  
    }

    mapping (address => uint256) public TotalDonatedUser;

    constructor() { }

    //------- MODIFIERS ----------
    modifier validateIdCoffees(uint256 _id) {
        require(_id < ClientCount, "Id: not found");
        _;
    }

    modifier validateStrings (
        string memory _name,
        string memory _description,
        string memory _urlImg
    ) {
        require(bytes(_name).length > 0, "Name is null");
        require(bytes(_description).length > 0, "Description is null");
        require(bytes(_urlImg).length > 0, "Image URL is null");
        _;
    }

    //------ EVENTS ------
    event ClientCreated (
        uint256 indexed userId,
        string _name,
        string _description,
        string _urlImg,
        address payable wallet
    );

    event CoffeesTipped (uint256 indexed userId, uint256 amountDonated);

    //------- INTERNAL -------
    function transferERC20(address _to, uint256 amount) internal {
        require(amount > 0);
        (bool success, ) = _to.call{value:amount}("");
        require(success, "Something went wrong");
    }

    //------- EXTERNAL ----------
    function tipCoffee(uint256 _id) external payable validateIdCoffees(_id) {
        Client memory _Client = Coffees[_id];
        address payable _user = _Client.wallet;
        Coffees[_id].tipAmount += msg.value;
        AmountTotal = AmountTotal + msg.value;
        TotalDonatedUser[msg.sender] += msg.value;
        transferERC20(_user, msg.value);
        emit CoffeesTipped(_id, _Client.tipAmount);        
    }

    //------- VIEW FUNCTIONS -------
    function getCoffeesList() public view returns (Client[] memory) {
        return Coffees;
    }
    
    //------- ADMIN FUNCTIONS -----------
    function createUser (
        string memory _name,
        string memory _description,
        string memory _urlImg,
        address payable wallet
    ) public onlyOwner validateStrings(_name, _description, _urlImg) {
        require(wallet != address(0x0));
        Client memory _Client = Client(
            ClientCount,
            _name,
            _description,
            _urlImg,
            0,
            wallet
        );
        Coffees.push(_Client);
        emit ClientCreated(ClientCount, _name, _description, _urlImg, wallet);
        ClientCount ++;
    }

    function editUser (
        string memory _name,
        string memory _description,
        string memory _urlImg,
        address payable wallet,
        uint256 _id
    ) public validateIdCoffees(_id) onlyOwner validateStrings(_name, _description, _urlImg) {
        require(wallet != address(0x0));
        Coffees[_id] = Client(
            _id, 
            _name,
            _description,
            _urlImg,
            Coffees[_id].tipAmount,
            wallet
        );
        emit ClientCreated(ClientCount, _name, _description, _urlImg, wallet);
    }

}