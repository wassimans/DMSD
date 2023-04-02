// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// This contract exposes a CRUD interface for managing DMSD's users
// gas consumption is expected to remain approximately consistent at
// any scale because each write operation proceeds in a step-by-step
// fashion with no branching or loops.
contract DMSD {
    struct User {
        string email;
        string firstName;
        string lastName;
        bool isRegistered;
        bool isAdmin;
        uint256 index;
    }

    address[] private _userIndex;
    mapping(address => User) private _users;
    mapping(address => address[]) private _userRecipients;

    // We index the userAddresses so clients can quickly filter,
    // sort and find relevant information in the event logs
    event LogNewUser(address indexed userAddress, uint256 index, string email);
    event LogUpdateUser(address indexed userAddress, uint256 index, string email);

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

    function registerAdmin(string calldata _userEmail, string calldata _firstName, string calldata _lastName)
        external
        onlyUnregistered(msg.sender)
        returns (bool success)
    {
        // only un-registred
        _users[msg.sender].email = _userEmail;
        _users[msg.sender].firstName = _firstName;
        _users[msg.sender].email = _lastName;
        _users[msg.sender].isRegistered = true;
        _users[msg.sender].isAdmin = true;
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
    ) external onlyAdmin onlyUnregistered(_userAddress) returns (bool success) {
        _users[_userAddress].email = _userEmail;
        _users[_userAddress].firstName = _firstName;
        _users[_userAddress].email = _lastName;
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
        returns (bool success)
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
        returns (bool success)
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
        returns (bool success)
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
        returns (bool success)
    {
        uint256 indexToDelete = _users[_userAddress].index;
        address indexToMove = _userIndex[_userIndex.length - 1];
        _userIndex[indexToDelete] = indexToMove;
        _users[indexToMove].index = indexToDelete;
        _userIndex.pop();
        return true;
    }
}
