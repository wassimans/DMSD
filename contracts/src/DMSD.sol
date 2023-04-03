// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./IERC20.sol";
import "./MultiSigWallet.sol";

// This contract exposes a CRUD interface for managing DMSD's users
// gas consumption is expected to remain approximately consistent at
// any scale because each write operation proceeds in a step-by-step
// fashion with no branching or loops.
contract DMSD {
    address MATIC_TOKEN_CONTRACT_ADDRESS = 0x0000000000000000000000000000000000001010;
    IERC20 public token;
    MultiSigWallet public personalMultiSig;
    MultiSigWallet public recipientMultiSig;

    struct User {
        string email;
        string firstName;
        string lastName;
        bool isRegistered;
        bool isAdmin;
        bool withRecipients;
        uint256 index;
    }

    address[] private _userIndex;
    mapping(address => User) private _users;
    mapping(address => address[]) private _userRecipients;
    address private _recoveryAddress;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // We index the userAddresses so clients can quickly filter,
    // sort and find relevant information in the event logs
    event LogNewUser(address indexed userAddress, uint256 index, string email);
    event LogUpdateUser(address indexed userAddress, uint256 index, string email);
    event LogDeleteUser(address indexed userAddress, uint256 index, string email);
    event LogNewPersonalMultisig(address indexed recoveryAddress);
    event LogNewRecipientMultisig(address[] indexed owners, uint256 indexed numConfirmationsRequired);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Modifiers ///////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    modifier onlyAdmin() {
        require(_users[msg.sender].isAdmin, "DMSD: You're not the Admin.");
        _;
    }

    modifier onlyUnregistered(address _userAddress) {
        require(!_users[_userAddress].isRegistered, "DMSD: You're not a registered user.");
        _;
    }

    modifier onlyRegistered(address _userAddress) {
        require(_users[_userAddress].isRegistered, "DMSD: You're not a registered user.");
        _;
    }

    modifier usersNotEmpty() {
        require(_userIndex.length != 0, "DMSD: User list is empty");
        _;
    }

    // Modifier to check the existence of keys before we permit any changes,
    // and before we return an instance
    modifier isUser(address _userAddress) {
        require(_userIndex[_users[_userAddress].index] == _userAddress, "DMSD: user does not exist.");
        _;
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Business logic //////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    function createPersonalMultisig(address _recovAddr) external onlyAdmin returns (bool) {
        setRecoveryAddress(_recovAddr);
        address[] memory owners = new address[](2);
        owners[0] = address(msg.sender);
        owners[1] = address(_recoveryAddress);
        personalMultiSig = new MultiSigWallet(owners, 1);
        emit LogNewPersonalMultisig(_recovAddr);
        return true;
    }

    function createrecipientsMultisig(address[] memory _owners, uint256 _numConfirmationsRequired)
        external
        returns (bool)
    {
        recipientMultiSig = new MultiSigWallet(_owners, _numConfirmationsRequired);
        emit LogNewRecipientMultisig(_owners, _numConfirmationsRequired);
        return true;
    }

    function approveTransfer(uint256 amount) external onlyAdmin {
        require(token.approve(address(this), amount), "DMSD: Approval failed");
    }

    function transferToMultiSig(uint256 amount) external returns (bool) {
        uint256 currentBalance = allowance[sender][msg.sender];
        require(currentBalance >= amount, "DMSD: transfer amount exceeds allowance");
        allowance[sender][msg.sender] = currentBalance - amount;
        emit Approval(sender, msg.sender, allowance[sender][msg.sender]);
        return _transfer(sender, recipient, amount);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        require(spender != address(0), "DMSD: approve to the zero address");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) private returns (bool) {
        require(recipient != address(0), "DMSD: transfer to the zero address");
        uint256 senderBalance = balanceOf[sender];
        require(senderBalance >= amount, "DMSD: transfer amount exceeds balance");
        balanceOf[sender] = senderBalance - amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);

        return true;
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Crud operations on users //////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    function registerAdmin(string calldata _userEmail, string calldata _firstName, string calldata _lastName)
        external
        onlyUnregistered(msg.sender)
        returns (bool)
    {
        _users[msg.sender].email = _userEmail;
        _users[msg.sender].firstName = _firstName;
        _users[msg.sender].lastName = _lastName;
        _users[msg.sender].isRegistered = true;
        _users[msg.sender].isAdmin = true;
        _users[msg.sender].withRecipients = false;
        _userIndex.push(msg.sender);
        _users[msg.sender].index = _userIndex.length;
        emit LogNewUser(msg.sender, _userIndex.length, _userEmail);
        return true;
    }

    function registerRecipient(
        address _userAddress,
        string calldata _userEmail,
        string calldata _firstName,
        string calldata _lastName
    ) external onlyAdmin onlyUnregistered(_userAddress) returns (bool) {
        _users[_userAddress].email = _userEmail;
        _users[_userAddress].firstName = _firstName;
        _users[_userAddress].lastName = _lastName;
        _users[_userAddress].isRegistered = true;
        _users[_userAddress].isAdmin = false;
        _userIndex.push(msg.sender);
        _users[_userAddress].index = _userIndex.length;
        _userRecipients[msg.sender].push(_userAddress);
        emit LogNewUser(_userAddress, _userIndex.length, _userEmail);
        return true;
    }

    function getUserAtIndex(uint256 index) external view returns (address userAddress) {
        return _userIndex[index];
    }

    function getUser(address _userAddress)
        external
        view
        usersNotEmpty
        isUser(_userAddress)
        onlyRegistered(_userAddress)
        returns (string memory userEmail, string memory firstName, string memory lastName, bool isAdmin)
    {
        return (
            _users[_userAddress].email,
            _users[_userAddress].firstName,
            _users[_userAddress].lastName,
            _users[_userAddress].isAdmin
        );
    }

    function updateUserEmail(address _userAddress, string calldata _userEmail)
        external
        onlyAdmin
        usersNotEmpty
        isUser(_userAddress)
        returns (bool)
    {
        _users[_userAddress].email = _userEmail;
        emit LogUpdateUser(_userAddress, _users[_userAddress].index, _userEmail);
        return true;
    }

    function updateUserFirstName(address _userAddress, string calldata _firstName)
        external
        onlyAdmin
        usersNotEmpty
        isUser(_userAddress)
        returns (bool)
    {
        _users[_userAddress].firstName = _firstName;
        emit LogUpdateUser(_userAddress, _users[_userAddress].index, _users[_userAddress].email);
        return true;
    }

    function updateUserLastName(address _userAddress, string calldata _lastName)
        external
        onlyAdmin
        usersNotEmpty
        isUser(_userAddress)
        returns (bool)
    {
        _users[_userAddress].firstName = _lastName;
        emit LogUpdateUser(_userAddress, _users[_userAddress].index, _users[_userAddress].email);
        return true;
    }

    // Deleting a user logically by removing it's index from _userIndex
    function deleteRecipient(address _userAddress)
        external
        onlyAdmin
        usersNotEmpty
        isUser(_userAddress)
        returns (bool)
    {
        uint256 indexToDelete = _users[_userAddress].index;
        address indexToMove = _userIndex[_userIndex.length - 1];
        string memory userEmail = _users[_userAddress].email;
        _userIndex[indexToDelete] = indexToMove;
        _users[indexToMove].index = indexToDelete;
        _userIndex.pop();
        emit LogDeleteUser(_userAddress, indexToDelete, userEmail);
        return true;
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Getters and setters ////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    function getRecoveryAddress() external view onlyAdmin returns (address) {
        return _recoveryAddress;
    }

    function setRecoveryAddress(address _recAddr) internal onlyAdmin {
        _recoveryAddress = _recAddr;
    }
}
