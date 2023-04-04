// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "./MultiSigWallet.sol";

contract DMSD {
    // address MATIC_TOKEN_CONTRACT_ADDRESS = 0x0000000000000000000000000000000000001010;
    ERC20 public token;
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
    address private _adminAddress;
    address private _recoveryAddress;

    // We index the userAddresses so clients can quickly filter,
    // sort and find relevant information in the event logs
    event LogNewUser(address indexed userAddress, uint256 index, string email);
    event LogUpdateUser(address indexed userAddress, uint256 index, string email);
    event LogDeleteUser(address indexed userAddress, uint256 index, string email);
    event LogNewPersonalMultisig(address indexed recoveryAddress);
    event LogNewRecipientMultisig(address[] indexed owners, uint256 indexed numConfirmationsRequired);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Constructs a new instance of the DMSD contract with the specified ERC20 token address.
     * @param tokenAddress The address of the ERC20 token contract to be used.
     */
    constructor(address tokenAddress) {
        token = ERC20(tokenAddress);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Modifiers ///////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    modifier onlyAdmin() {
        require(_users[msg.sender].isAdmin, "DMSD: You're not the Admin.");
        _;
    }

    modifier onlyUnregistered(address _userAddress) {
        require(!_users[_userAddress].isRegistered, "DMSD: You're already a registered user.");
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

    /**
     * @dev Creates a new personal multisig wallet contract with the sender and the recovery address as owners.
     * @param _recovAddr The address that will be set as the recovery address for the personal multisig wallet.
     * @return A boolean indicating whether the personal multisig wallet was successfully created.
     *  @dev The event LogNewPersonalMultisig will be emitted upon successful deployment of the new multisignature wallet contract.
     */
    function createPersonalMultisig(address _recovAddr) external onlyAdmin returns (bool) {
        setRecoveryAddress(_recovAddr);
        address[] memory owners = new address[](2);
        owners[0] = address(msg.sender);
        owners[1] = address(_recoveryAddress);
        personalMultiSig = new MultiSigWallet(owners, 1);
        emit LogNewPersonalMultisig(_recovAddr);
        return true;
    }

    /**
     * @notice Creates a new multisignature wallet contract for recipients.
     * @param _owners Array of addresses representing the owners of the new wallet.
     * @param _numConfirmationsRequired Number of confirmations required to execute a transaction from the new wallet.
     * @return A boolean indicating whether the operation was successful.
     * @dev The new multisignature wallet contract will be deployed using the provided array of owner addresses and confirmation requirements.
     * @dev The event LogNewRecipientMultisig will be emitted upon successful deployment of the new multisignature wallet contract.
     */
    function createrecipientsMultisig(address[] memory _owners, uint256 _numConfirmationsRequired)
        external
        returns (bool)
    {
        recipientMultiSig = new MultiSigWallet(_owners, _numConfirmationsRequired);
        emit LogNewRecipientMultisig(_owners, _numConfirmationsRequired);
        return true;
    }

    /**
     * @dev Approves a transfer of tokens from the administrator's address to the contract address, and emits an Approval event.
     * This function can only be called by an administrator account.
     * @return A boolean value indicating whether the approval was successful.
     * @notice This function may fail if the transfer of tokens from the administrator's address to the contract address fails.
     * @notice The Approval event is emitted with the administrator's address as the `owner`, the contract address as the `spender`,
     * and the amount of tokens transferred from the administrator's address to the contract address as the `value`.
     */
    function approveTransfer() external onlyAdmin returns (bool) {
        require(token.transfer(address(this), _adminAddress.balance), "DMSD: Approval failed");
        emit Approval(_adminAddress, address(this), _adminAddress.balance);
        return true;
    }

    /**
     * @dev Transfers tokens from the admin's address to either the personal multi-sig or recipients multi-sig address,
     * depending on whether there are any user recipients registered for the admin.
     * Emits a Transfer event upon successful transfer.
     *
     * Requirements:
     * - The admin address must have approved the smart contract to transfer tokens on its behalf.
     * - The transfer to the multi-sig address must succeed.
     *
     * @return A boolean indicating whether the transfer was successful.
     */
    function transferToMultiSig() external returns (bool) {
        if (_userRecipients[_adminAddress].length > 0) {
            require(
                token.transferFrom(_adminAddress, address(personalMultiSig), _adminAddress.balance),
                "DMSD: transfer to multisig failed"
            );
            emit Transfer(_adminAddress, address(personalMultiSig), _adminAddress.balance);
        } else {
            require(
                token.transferFrom(_adminAddress, address(recipientMultiSig), _adminAddress.balance),
                "DMSD: transfer to multisig failed"
            );
            emit Transfer(_adminAddress, address(recipientMultiSig), _adminAddress.balance);
        }
        return true;
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Crud operations on users //////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    // This contract exposes a CRUD interface for managing DMSD's users
    // gas consumption is expected to remain approximately consistent at
    // any scale because each write operation proceeds in a step-by-step
    // fashion with no branching or loops.

    /**
     * @dev Registers an admin with the given email, first name, and last name.
     * Only unregistered addresses can register as admin.
     * @param _userEmail The email address of the user.
     * @param _firstName The first name of the user.
     * @param _lastName The last name of the user.
     * @return bool true if registration is successful.
     */
    function registerAdmin(string calldata _userEmail, string calldata _firstName, string calldata _lastName)
        external
        onlyUnregistered(msg.sender)
        returns (bool)
    {
        setAdminAddress(msg.sender);
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

    /**
     * @notice Registers a new recipient on the platform by an admin user.
     * @dev The function can only be called by an admin user and can only register an unregistered user.
     * @param _userAddress The address of the user to be registered as a recipient.
     * @param _userEmail The email address of the user to be registered.
     * @param _firstName The first name of the user to be registered.
     * @param _lastName The last name of the user to be registered.
     * @return A boolean indicating whether the registration was successful or not.
     */
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

    /// @notice Gets the address of the user at the given index in the `_userIndex` array.
    /// @dev This function can be used to retrieve the addresses of all registered users.
    /// @param index The index of the user in the `_userIndex` array.
    /// @return userAddress The address of the user at the given index.
    function getUserAtIndex(uint256 index) external view returns (address userAddress) {
        return _userIndex[index];
    }

    /**
     * @dev Returns the email, first name, last name and admin status of a registered user.
     *
     * Requirements:
     * - The user must be registered.
     *
     * @param _userAddress The address of the user to retrieve information for.
     * @return userEmail The email address associated with the user.
     * @return firstName The first name associated with the user.
     * @return lastName The last name associated with the user.
     * @return isAdmin A boolean indicating whether the user is an admin or not.
     */
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

    /**
     * @dev Updates the email address of a registered user.
     * @param _userAddress The Ethereum address of the user.
     * @param _userEmail The new email address of the user.
     * @return A boolean value indicating whether the email address was updated successfully.
     * Emits a LogUpdateUser event on success.
     * Requirements:
     * - Only the contract admin can call this function.
     * - The user list must not be empty.
     * - The user must be registered.
     */
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

    /**
     * @dev Update the first name of a registered user.
     * @param _userAddress The address of the user to update.
     * @param _firstName The new first name for the user.
     * @return A boolean indicating whether the operation was successful.
     *
     * Emits a {LogUpdateUser} event.
     * Requirements:
     * - The function can only be called by an admin.
     * - The list of users cannot be empty.
     * - The user must be registered.
     */
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

    /**
     * @dev Updates the last name of a user.
     * @param _userAddress The address of the user to update.
     * @param _lastName The new last name to set for the user.
     * @return A boolean indicating whether the update was successful.
     */
    function updateUserLastName(address _userAddress, string calldata _lastName)
        external
        onlyAdmin
        usersNotEmpty
        isUser(_userAddress)
        returns (bool)
    {
        _users[_userAddress].lastName = _lastName;
        emit LogUpdateUser(_userAddress, _users[_userAddress].index, _users[_userAddress].email);
        return true;
    }

    /**
     * @dev Deletes logically a recipient from the list of registered users. Only the admin can perform this action.
     * @param _userAddress The address of the recipient to be deleted.
     * @return A boolean indicating whether the operation was successful.
     */
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

    function setAdminAddress(address _addr) internal onlyAdmin {
        _adminAddress = _addr;
    }

    function getRecoveryAddress() external view onlyAdmin returns (address) {
        return _recoveryAddress;
    }

    function setRecoveryAddress(address _recAddr) internal onlyAdmin {
        require(_recAddr != address(0), "DMSD: setting recovery address to 0");
        _recoveryAddress = _recAddr;
    }
}
