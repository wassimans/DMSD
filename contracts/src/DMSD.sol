// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "./MultiSigWallet.sol";

contract DMSD {
    struct User {
        string email;
        string username;
        bool isRegistered;
        bool isAdmin;
        bool withRecipients;
        uint256 index;
    }

    MultiSigWallet public personalMultiSig; // Instance of the personal multisig wallet
    MultiSigWallet public recipientMultiSig; // Instance of of the recipients multisig wallet
    ERC20 public dToken; // Instance of the token contract

    address[] public userIndex; // Array of all user addresses
    mapping(address => User) public users; // Mapping of user addresses to user structs
    mapping(address => address[]) private _userRecipients; // Mapping of user addresses to recipient addresses
    address public adminAddress; // Address of the admin
    address public walletToProtect; // Address of the wallet to protect
    address[2] public recoveryWallets; // Array of addresses of the recovery wallets

    // We index the userAddresses so clients can quickly filter,
    // sort and find relevant information in the event logs
    event LogNewUser(address indexed userAddress, uint256 index, string email);
    event LogDeleteUser(address indexed userAddress, uint256 index, string email);
    event LogNewPersonalMultisig(address[2] indexed recoveryWallets);
    event LogNewRecipientMultisig(address[] indexed owners, uint256 indexed numConfirmationsRequired);
    event Transfer(address indexed from, address indexed to, uint256 value);

    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Modifiers ///////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    modifier onlyAdmin() {
        require(users[msg.sender].isAdmin, "DMSD: You're not the Admin.");
        _;
    }

    modifier onlyUnregistered(address _userAddress) {
        require(!users[_userAddress].isRegistered, "DMSD: You're already a registered user.");
        _;
    }

    modifier usersNotEmpty() {
        require(userIndex.length != 0, "DMSD: User list is empty");
        _;
    }

    // Modifier to check the existence of keys before we permit any changes,
    // and before we return an instance
    // modifier isUser(address _userAddress) {
    //     require(userIndex[users[_userAddress].index] == _userAddress, "DMSD: user does not exist.");
    //     _;
    // }

    modifier isUser(address _userAddress) {
        require(users[_userAddress].isRegistered, "DMSD: user does not exist.");
        require(
            userIndex.length == users[_userAddress].index && userIndex[users[_userAddress].index - 1] == _userAddress,
            "DMSD: user does not exist."
        );
        _;
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Business logic //////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    /**
     * @dev Creates a new personal multisig wallet contract with the recovery addresses and the contract itself as owners.
     * @param _recovAddrs The addresses that will be set as the recovery addresses for the personal multisig wallet.
     * @return A boolean indicating whether the personal multisig wallet was successfully created.
     *  @dev The event LogNewPersonalMultisig will be emitted upon successful deployment of the new multisignature wallet contract.
     */
    function createPersonalMultisig(address[2] memory _recovAddrs, address _walletToProtect)
        external
        onlyAdmin
        returns (bool)
    {
        _setRecoveryWallets(_recovAddrs);
        _setWalletToProtect(_walletToProtect);
        address[] memory owners = new address[](3);
        owners[0] = _recovAddrs[0];
        owners[1] = _recovAddrs[1];
        owners[2] = address(this);
        personalMultiSig = new MultiSigWallet(owners, 2);
        emit LogNewPersonalMultisig(_recovAddrs);
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
    function createRecipientsMultisig(address[] memory _owners, uint256 _numConfirmationsRequired)
        external
        onlyAdmin
        returns (bool)
    {
        recipientMultiSig = new MultiSigWallet(_owners, _numConfirmationsRequired);
        emit LogNewRecipientMultisig(_owners, _numConfirmationsRequired);
        return true;
    }

    /**
     * @notice Transfers tokens from the contract to the multisig wallet for safekeeping.
     * @dev This function can only be called by the admin address. It calls the internal function
     * _transferFromToMultisig to transfer tokens from the contract to the multisig wallet.
     * @param _amount The amount of tokens to transfer.
     * @return A boolean indicating whether the transfer was successful.
     */
    function transferToMultisig(uint256 _amount) external onlyAdmin returns (bool) {
        // Transfer tokens from EOA to multi-sig wallet
        dToken.approve(address(this), msg.sender.balance);
        return _transferFromToMultisig(_amount);
    }

    /**
     * @notice Transfers tokens from this contract to the multi-sig wallet.
     * @dev If the admin has set any user-defined recipients, the tokens are transferred to the recipient multi-sig wallet,
     * otherwise they are transferred to the personal multi-sig wallet.
     * @param _amount The amount of tokens to transfer.
     * @return A boolean indicating whether the transfer was successful.
     * @dev Throws an error if the token transfer fails.
     */
    function _transferFromToMultisig(uint256 _amount) private returns (bool) {
        // Transfer tokens from EOA to multi-sig wallet
        if (_userRecipients[adminAddress].length > 0) {
            require(
                dToken.transferFrom(msg.sender, address(recipientMultiSig), _amount),
                "DMSD: transfer to recipient multisig failed"
            );
        } else {
            require(
                dToken.transferFrom(msg.sender, address(personalMultiSig), _amount),
                "DMSD: transfer to personal multisig failed"
            );
        }
        return true;
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// User operations ////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    // This contract exposes a pseudo-CRUD interface for managing DMSD's users
    // gas consumption is expected to remain approximately consistent at
    // any scale because each write operation proceeds in a step-by-step
    // fashion with no branching or loops.

    /**
     * @dev Registers an admin with the given email, first name, and last name.
     * Only unregistered addresses can register as admin.
     * @param _userEmail The email address of the user.
     * @param _username The username of the user.
     * @return bool true if registration is successful.
     */
    function registerAdmin(string calldata _userEmail, string calldata _username)
        external
        onlyUnregistered(msg.sender)
        returns (bool)
    {
        _setAdminAddress(msg.sender);
        users[msg.sender].email = _userEmail;
        users[msg.sender].username = _username;
        users[msg.sender].isRegistered = true;
        users[msg.sender].isAdmin = true;
        users[msg.sender].withRecipients = false;
        userIndex.push(msg.sender);
        users[msg.sender].index = userIndex.length;
        emit LogNewUser(msg.sender, userIndex.length, _userEmail);
        return true;
    }

    /**
     * @notice Registers a new recipient on the platform by an admin user.
     * @dev The function can only be called by an admin user and can only register an unregistered user.
     * @param _userAddress The address of the user to be registered as a recipient.
     * @param _userEmail The email address of the user to be registered.
     * @param _username The username of the user to be registered.
     * @return A boolean indicating whether the registration was successful or not.
     */
    function registerRecipient(address _userAddress, string calldata _userEmail, string calldata _username)
        external
        onlyAdmin
        onlyUnregistered(_userAddress)
        returns (bool)
    {
        users[_userAddress].email = _userEmail;
        users[_userAddress].username = _username;
        users[_userAddress].isRegistered = true;
        users[_userAddress].isAdmin = false;
        users[msg.sender].withRecipients = false;
        userIndex.push(_userAddress);
        users[_userAddress].index = userIndex.length;
        _userRecipients[msg.sender].push(_userAddress);
        emit LogNewUser(_userAddress, userIndex.length, _userEmail);
        return true;
    }

    /// @notice Gets the address of the user at the given index in the `userIndex` array.
    /// @dev This function can be used to retrieve the addresses of all registered users.
    /// @param index The index of the user in the `userIndex` array.
    /// @return userAddress The address of the user at the given index.
    function getUserAtIndex(uint256 index) external view returns (address userAddress) {
        return userIndex[index];
    }

    /**
     * @dev Returns the email, username and admin status of a registered user.
     *
     * Requirements:
     * - The user must be registered.
     *
     * @param _userAddress The address of the user to retrieve information for.
     * @return userEmail The email address associated with the user.
     * @return username The username associated with the user.
     * @return isAdmin A boolean indicating whether the user is an admin or not.
     */
    function getUser(address _userAddress)
        external
        view
        usersNotEmpty
        isUser(_userAddress)
        returns (string memory userEmail, string memory username, bool isAdmin, bool isRegistered, bool withRecipients)
    {
        return (
            users[_userAddress].email,
            users[_userAddress].username,
            users[_userAddress].isAdmin,
            users[_userAddress].isRegistered,
            users[_userAddress].withRecipients
        );
    }

    //////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////// Getters, setters and helpers /////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    function _setAdminAddress(address _addr) private {
        adminAddress = _addr;
    }

    function getRecoveryWallets() external view onlyAdmin returns (address[2] memory) {
        return recoveryWallets;
    }

    function _setRecoveryWallets(address[2] memory _recAddrs) private {
        require(_recAddrs[0] != address(0) && _recAddrs[1] != address(0), "DMSD: setting recovery wallets to 0");
        recoveryWallets = _recAddrs;
    }

    function setToken(address _dToken) public {
        dToken = ERC20(_dToken);
    }

    function _setWalletToProtect(address _walletToProtect) private {
        walletToProtect = _walletToProtect;
    }

    function getWalletToProtect() external view returns (address) {
        return walletToProtect;
    }
}
