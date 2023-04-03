// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/**
 * @title MultiSigWallet
 * @dev A multisignature wallet that requires a certain number of owners to confirm transactions
 */
contract MultiSigWallet {
    /**
     * @dev Emitted when ether is deposited into the contract.
     * @param sender The address that sent the ether.
     * @param amount The amount of ether that was sent.
     * @param balance The new balance of the contract after the deposit.
     */
    event Deposit(address indexed sender, uint256 amount, uint256 balance);

    /**
     * @dev Emitted when a new transaction is submitted to the contract.
     * @param owner The address of the owner that submitted the transaction.
     * @param txIndex The index of the transaction in the transactions array.
     * @param to The address that the transaction is sending ether to.
     * @param value The amount of ether that the transaction is sending.
     * @param data Additional data that is sent with the transaction.
     */
    event SubmitTransaction(
        address indexed owner, uint256 indexed txIndex, address indexed to, uint256 value, bytes data
    );

    /**
     * @dev Emitted when an owner confirms a transaction.
     * @param owner The address of the owner that confirmed the transaction.
     * @param txIndex The index of the transaction in the transactions array.
     */
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);

    /**
     * @dev Emitted when an owner revokes their confirmation of a transaction.
     * @param owner The address of the owner that revoked their confirmation.
     * @param txIndex The index of the transaction in the transactions array.
     */
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);

    /**
     * @dev Emitted when a transaction is executed.
     * @param owner The address of the owner that executed the transaction.
     * @param txIndex The index of the transaction in the transactions array.
     */
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
    }

    // mapping from tx index => owner => bool
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    /**
     * @dev Modifier that only allows the multisig owners to call the function.
     */
    modifier onlyOwner() {
        require(isOwner[msg.sender], "DMSD MSig: not owner");
        _;
    }

    /**
     * @dev Modifier that checks if a transaction exists.
     * @param _txIndex The index of the transaction in the transactions array.
     */
    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "DMSD MSig: tx does not exist");
        _;
    }

    /**
     * @dev Modifier that checks if a transaction has not already been executed.
     * @param _txIndex The index of the transaction in the transactions array.
     */
    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "DMSD MSig: tx already executed");
        _;
    }

    /**
     * @dev Modifier that checks if the transaction has not already been confirmed by the owner
     * @param _txIndex The index of the transaction to check
     */
    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "DMSD MSig: tx already confirmed");
        _;
    }

    /**
     * @dev Constructor function for the MultiSigWallet contract
     * @param _owners The addresses of the owners of the wallet
     * @param _numConfirmationsRequired The number of confirmations required per transaction
     */
    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) {
        require(_owners.length > 0, "DMSD MSig: owners required");
        require(
            _numConfirmationsRequired > 0 && _numConfirmationsRequired <= _owners.length,
            "DMSD MSig: invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "DMSD MSig: invalid owner");
            require(!isOwner[owner], "DMSD MSig: owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    /**
     * @notice Submits a new transaction to the multisig wallet.
     * @dev Only the owners of the multisig wallet can call this function.
     * @param _to The address of the contract or account to call.
     * @param _value The amount of ETH to transfer.
     * @param _data The data to include in the transaction call.
     */

    function submitTransaction(address _to, uint256 _value, bytes memory _data) public onlyOwner {
        uint256 txIndex = transactions.length;
        transactions.push(Transaction({to: _to, value: _value, data: _data, executed: false, numConfirmations: 0}));

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    /**
     * @notice Confirms a pending transaction.
     * @dev Only the owners of the multisig wallet can call this function and must not have confirmed this transaction before.
     * @param _txIndex The index of the transaction to confirm.
     */
    function confirmTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    /**
     * @notice This function can only be called by an owner of the multisig wallet and the transaction must exist,
     *  not have been executed, and have the required number of confirmations.
     * @dev Executes a transaction with the given index _txIndex if it has been confirmed by the required number of owners.
     * @param _txIndex The index of the transaction to be executed.
     * @notice If the transaction execution fails, the transaction will be reverted.
     */
    function executeTransaction(uint256 _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(transaction.numConfirmations >= numConfirmationsRequired, "DMSD MSig: cannot execute tx");

        transaction.executed = true;

        (bool success,) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "DMSD MSig: tx failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    /**
     * @dev Allows an owner to revoke their confirmation of a transaction.
     * Requirements:
     * The caller must be an owner.
     * The transaction must exist and not have been executed.
     * The caller must have already confirmed the transaction.
     * @param _txIndex The index of the transaction to revoke confirmation for.
     */
    function revokeConfirmation(uint256 _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "DMSD MSig: tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    /**
     * @dev Returns the list of all owners of the multi-sig wallet.
     * @return An array of addresses representing the owners.
     */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /**
     * @dev Returns the number of transactions in the multisig wallet.
     * @return The number of transactions in the wallet as an unsigned integer.
     */
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    /**
     * @notice Returns the details of a transaction at a given index in the transactions array.
     * @param _txIndex The index of the transaction to retrieve.
     * @return to The address that the transaction is intended for.
     * @return value The amount of Ether that the transaction is sending.
     * @return data The data payload of the transaction.
     * @return executed A boolean indicating whether the transaction has been executed or not.
     * @return numConfirmations The number of confirmations the transaction has received.
     */
    function getTransaction(uint256 _txIndex)
        public
        view
        returns (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations)
    {
        Transaction storage transaction = transactions[_txIndex];

        return (transaction.to, transaction.value, transaction.data, transaction.executed, transaction.numConfirmations);
    }
}
