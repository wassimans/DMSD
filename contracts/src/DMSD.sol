// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";

import "./MultiSigWallet.sol";

contract DMSD is ReentrancyGuard {
    struct User {
        string email;
        string username;
        bool isRegistered;
        bool isAdmin;
        bool subscribed;
        uint256 index;
    }

    // WMATIC contract address on MUMBAI testnet
    address WMATIC_ADDRESS = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;

    MultiSigWallet public personalMultiSig; // Instance of the personal multisig wallet
    ERC20 public wmatic; // Instance of the token contract

    address[] public userIndex; // Array of all user addresses
    mapping(address => User) public users; // Mapping of user addresses to user structs
    address public adminAddress; // Address of the admin
    mapping(address => address) public walletToProtect; // Mapping of admin to wallet to protect
    mapping(address => bool) public isWAlletToProtect; // Boolean indicating whether the address is a wallet to protect
    mapping(address => address[2]) public recoveryWallets; // Array of addresses of the recovery wallets
    mapping(address => mapping(address => bool)) public approvals; // Mapping wallet to protect to DMSD to approval status
    mapping(address => mapping(address => bool)) public transfers; // Mapping wallet to protect to multisig to transfer status

    // We index the userAddresses so clients can quickly filter,
    // sort and find relevant information in the event logs
    event LogNewUser(address indexed userAddress, uint256 index, string email);
    event LogNewSubscription(address indexed userAddress);
    event LogDeleteUser(address indexed userAddress, uint256 index, string email);
    event LogNewPersonalMultisig(address[2] indexed recoveryWallets);
    event LogNewApproval(address indexed from, address indexed to, uint256 amount);
    event Deposit(address indexed sender, uint256 amount, uint256 balance);

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

    modifier isUser(address _userAddress) {
        require(users[_userAddress].isRegistered, "DMSD: user does not exist.");
        require(
            userIndex.length == users[_userAddress].index && userIndex[users[_userAddress].index - 1] == _userAddress,
            "DMSD: user does not exist."
        );
        _;
    }

    modifier onlySubscribed(address _userAddress) {
        require(users[_userAddress].subscribed, "DMSD: User not subscribed to the service.");
        _;
    }

    modifier onlyWalletToProtect(address _userAddress) {
        require(isWAlletToProtect[_userAddress], "DMSD: This is not a wallet to protect.");
        _;
    }

    constructor() {
        // Instantiate the WMATIC contract
        wmatic = ERC20(WMATIC_ADDRESS);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Business logic //////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    /**
     * @notice Allows an admin to subscribe to the service.
     * @dev This function can only be called by an admin and sets the `subscribed` flag to `true` for the caller.
     * @return A boolean indicating whether the subscription was successful.
     */
    function subscribeAdmin() external onlyAdmin returns (bool) {
        require(!users[msg.sender].subscribed, "DMSD: User already subscribed to the service.");
        users[msg.sender].subscribed = true;
        emit LogNewSubscription(msg.sender);
        return true;
    }

    /**
     * @dev Creates a new personal multisig wallet contract with the recovery addresses and the contract itself as owners.
     * @param _recovAddrs The addresses that will be set as the recovery addresses for the personal multisig wallet.
     * @return A boolean indicating whether the personal multisig wallet was successfully created.
     *  @dev The event LogNewPersonalMultisig will be emitted upon successful deployment of the new multisignature wallet contract.
     */
    function createPersonalMultisig(address[2] memory _recovAddrs, address _walletToProtect)
        external
        onlyAdmin
        onlySubscribed(msg.sender)
        returns (bool)
    {
        _setRecoveryWallets(_recovAddrs);
        _setWalletToProtect(_walletToProtect);
        _setIsWalletToProtect(_walletToProtect);
        address[] memory owners = new address[](3);
        owners[0] = _recovAddrs[0];
        owners[1] = _recovAddrs[1];
        owners[2] = address(this);
        personalMultiSig = new MultiSigWallet(owners, 2);
        emit LogNewPersonalMultisig(_recovAddrs);
        return true;
    }

    /**
     * @dev Validates the approval of the current subscriber to protect the wallet.
     * Only an admin who is a subscribed user can call this function.
     * Sets the approvals of the wallet to false.
     *
     * Requirements:
     * - The caller must be an admin user who is already subscribed.
     *
     * @return bool Returns true if the approval is successfully validated and the approvals of the wallet is set to false.
     */

    function validateApproval() external onlyAdmin onlySubscribed(msg.sender) returns (bool) {
        _setApprovals(walletToProtect[msg.sender], false);
        _setTransfers(walletToProtect[msg.sender], false);
        return true;
    }

    /**
     * @dev Approves the transfer of tokens from the wallet to protect to the smart contract,
     * and sets the approval status to true. Only the wallet to protect can call this function.
     * @return A boolean indicating whether the transfer was approved and the approval status was set.
     * Emits an Approval event with the wallet to protect, the smart contract, and the balance approved.
     * Emits an ApprovalStatusChanged event with the wallet to protect and the new approval status.
     * Reverts if the approval failed.
     */
    function approveTransfer() external onlyWalletToProtect(msg.sender) returns (bool) {
        require(wmatic.approve(address(this), msg.sender.balance), "DMSD: approve failed");
        _setApprovals(msg.sender, true);
        emit LogNewApproval(msg.sender, address(personalMultiSig), msg.sender.balance);
        return true;
    }

    /**
     * @notice Transfers tokens from this contract to the multi-sig wallet.
     * @dev If the admin has set any user-defined recipients, the tokens are transferred to the recipient multi-sig wallet,
     * otherwise they are transferred to the personal multi-sig wallet.
     * @param _amount The amount of tokens to transfer.
     * @return A boolean indicating whether the transfer was successful.
     * @dev Throws an error if the token transfer fails.
     */
    function transferFromToMultisig(uint256 _amount) external onlyAdmin returns (bool) {
        require(
            transfer(walletToProtect[msg.sender], address(personalMultiSig), _amount),
            "DMSD: transfer to personal multisig failed"
        );
        _setTransfers(msg.sender, true);
        return true;
    }

    function transfer(address _from, address _to, uint256 _amount) internal nonReentrant returns (bool) {
        require(wmatic.transferFrom(_from, _to, _amount), "DMSD: transfer to personal multisig failed");
        return true;
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// User operations ////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

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
        users[msg.sender].subscribed = false;
        userIndex.push(msg.sender);
        users[msg.sender].index = userIndex.length;
        emit LogNewUser(msg.sender, userIndex.length, _userEmail);
        return true;
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
        returns (string memory userEmail, string memory username, bool isAdmin, bool isRegistered, bool subscribed)
    {
        return (
            users[_userAddress].email,
            users[_userAddress].username,
            users[_userAddress].isAdmin,
            users[_userAddress].isRegistered,
            users[_userAddress].subscribed
        );
    }

    //////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////// Getters, setters and helpers /////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    function _setAdminAddress(address _addr) private {
        adminAddress = _addr;
    }

    function getRecoveryWallets() external view onlyAdmin returns (address[2] memory) {
        require(recoveryWallets[msg.sender].length > 0, "DMSD: recovery wallets not set");
        return recoveryWallets[msg.sender];
    }

    function _setRecoveryWallets(address[2] memory _recAddrs) private {
        require(_recAddrs[0] != address(0) && _recAddrs[1] != address(0), "DMSD: setting recovery wallets to 0");
        recoveryWallets[msg.sender] = _recAddrs;
    }

    function setToken(address _wmatic) public {
        wmatic = ERC20(_wmatic);
    }

    function _setWalletToProtect(address _walletToProtect) private {
        walletToProtect[msg.sender] = _walletToProtect;
    }

    function getWalletToProtect() external view returns (address) {
        return walletToProtect[msg.sender];
    }

    function getApprovals() external view returns (bool) {
        return approvals[walletToProtect[msg.sender]][address(this)];
    }

    function getApprovalsFromWalletToProtect() external view returns (bool) {
        return approvals[msg.sender][address(this)];
    }

    function _setApprovals(address _sender, bool _approval) private {
        approvals[_sender][address(this)] = _approval;
    }

    function getTransfers() external view returns (bool) {
        return approvals[msg.sender][address(personalMultiSig)];
    }

    function _setTransfers(address _sender, bool _approval) private {
        approvals[_sender][address(personalMultiSig)] = _approval;
    }

    function getIsWalletToProtect(address _walletToProtect) external view returns (bool) {
        return isWAlletToProtect[_walletToProtect];
    }

    function _setIsWalletToProtect(address _walletToProtect) private {
        isWAlletToProtect[_walletToProtect] = true;
    }

    function getPersonalMultiSig() external view returns (address) {
        return address(personalMultiSig);
    }

    function getPersonalMultiSigBalance() external view returns (uint256) {
        return address(personalMultiSig).balance;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
}
