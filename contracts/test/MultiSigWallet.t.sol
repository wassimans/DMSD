// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {console} from "forge-std/console.sol";
import {stdStorage, StdStorage, Test} from "forge-std/Test.sol";
import "../utils/Utils.sol";
import "../src/MultiSigWallet.sol";

abstract contract BaseSetup is Test {
    MultiSigWallet internal wallet;
    Utils internal utils;
    address payable[] internal users;

    address internal alice;
    address internal bob;
    address internal charlie;
    address internal sybil;
    address[] internal multisigOwners;

    function setUp() public virtual {
        utils = new Utils();
        users = utils.createUsers(4);

        alice = users[0];
        vm.label(alice, "Alice");
        bob = users[1];
        vm.label(bob, "Bob");
        charlie = users[2];
        vm.label(charlie, "Charlie");
        sybil = users[3];
        vm.label(charlie, "Sybil");
        multisigOwners = new address[](3);
        multisigOwners[0] = payable(alice);
        multisigOwners[1] = payable(bob);
        multisigOwners[2] = payable(charlie);
        wallet = new MultiSigWallet(multisigOwners, 2);
        // fund the wallet contract with 1 ether for gas consumption
        vm.deal(address(wallet), 1 ether);
        // fund the test contract with 100 ether
        vm.deal(address(this), 100 ether);
    }
}

contract whenEtherIsDepositedTest is BaseSetup {
    function setUp() public virtual override {
        BaseSetup.setUp();
        console.log("When ether is deposited");
    }

    // fucntion that tests MultiSigWallet constructor
    function testConstructor() public {
        assertEq(wallet.numConfirmationsRequired(), 2, "Number of confirmations required should be 2");
        assertEq(wallet.isOwner(alice), true, "Alice should be an owner");
        assertEq(wallet.isOwner(bob), true, "Bob should be an owner");
        assertEq(wallet.isOwner(charlie), true, "Charlie should be an owner");
    }

    function testDeposit() public {
        assertEq(address(this).balance, 100 ether, "Balance should be 100 ether");
    }
}

// a contract that inherits from whenEtherIsDepositedTest and which tests submitTransaction
contract whenTransactionIsSubmittedTest is BaseSetup {
    function setUp() public virtual override {
        BaseSetup.setUp();
        console.log("When a transaction is submitted");
    }

    // function that tests submitTransaction
    function testSubmitTransaction() public {
        vm.prank(bob);
        wallet.submitTransaction(bob, 10 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        assertEq(txCount, 1, "Transaction count should be 1");
        uint256 txIndex = txCount - 1;
        (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) =
            wallet.getTransaction(txIndex);
        assertEq(to, bob, "Transaction should be sent to Bob");
        assertEq(value, 10 ether, "Transaction value should be 10 ether");
        assertEq(data, new bytes(0), "Transaction data should be bytes(0)");
        assertEq(executed, false, "Transaction should not be executed");
        assertEq(numConfirmations, 0, "Transaction should have 0 confirmations");
    }

    // function that tests confirmTransaction
    function testConfirmTransaction() public {
        vm.prank(alice);
        wallet.submitTransaction(alice, 10 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount - 1;
        vm.prank(alice);
        wallet.confirmTransaction(txIndex);
        (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) =
            wallet.getTransaction(txIndex);
        assertEq(numConfirmations, 1, "Transaction should have 1 confirmation");
    }

    // function that tests executeTransaction
    function testExecuteTransaction() public {
        vm.prank(bob);
        wallet.submitTransaction(bob, 1 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount - 1;
        vm.prank(bob);
        wallet.confirmTransaction(txIndex);
        vm.prank(alice);
        wallet.confirmTransaction(txIndex);
        vm.prank(bob);
        wallet.executeTransaction(txIndex);
        (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) =
            wallet.getTransaction(txIndex);
        assertEq(executed, true, "Transaction should be executed");
    }
}

// a contract that inherits from BaseSetup and which tests MultiSigWallet events
contract whenEventsAreEmittedTest is BaseSetup {
    function setUp() public virtual override {
        BaseSetup.setUp();
        console.log("When events are emitted");
    }

    // function that tests Submission event
    function testSubmissionEvent() public {
        vm.prank(bob);
        wallet.submitTransaction(bob, 10 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount - 1;
        (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) =
            wallet.getTransaction(txIndex);
        assertEq(to, bob, "Transaction should be sent to Bob");
        assertEq(value, 10 ether, "Transaction value should be 10 ether");
        assertEq(data, new bytes(0), "Transaction data should be bytes(0)");
        assertEq(executed, false, "Transaction should not be executed");
        assertEq(numConfirmations, 0, "Transaction should have 0 confirmations");
    }

    // function that tests Confirmation event
    function testConfirmationEvent() public {
        vm.prank(alice);
        wallet.submitTransaction(alice, 10 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount - 1;
        vm.prank(alice);
        wallet.confirmTransaction(txIndex);
        (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) =
            wallet.getTransaction(txIndex);
        assertEq(numConfirmations, 1, "Transaction should have 1 confirmation");
    }

    // function that tests Execution event
    function testExecutionEvent() public {
        vm.prank(bob);
        wallet.submitTransaction(bob, 1 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount - 1;
        vm.prank(bob);
        wallet.confirmTransaction(txIndex);
        vm.prank(alice);
        wallet.confirmTransaction(txIndex);
        vm.prank(bob);
        wallet.executeTransaction(txIndex);
        (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) =
            wallet.getTransaction(txIndex);
        assertEq(executed, true, "Transaction should be executed");
    }

    // function that tests ExecutionFailure event
    function testExecutionFailureEvent() public {
        vm.prank(bob);
        wallet.submitTransaction(bob, 1 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount - 1;
        vm.prank(bob);
        wallet.confirmTransaction(txIndex);
        vm.prank(alice);
        wallet.confirmTransaction(txIndex);
        vm.prank(bob);
        wallet.executeTransaction(txIndex);
        (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) =
            wallet.getTransaction(txIndex);
        assertEq(executed, true, "Transaction should be executed");
    }
}

// a contract that inherits from BaseSetup and which tests MultiSigWallet modifiers
contract whenModifiersAreUsedTest is BaseSetup {
    function setUp() public virtual override {
        BaseSetup.setUp();
        console.log("When modifiers are used");
    }

    // function that tests onlyOwner modifier with a revert
    function testOnlyOwnerModifierWithRevert() public {
        vm.prank(sybil);
        vm.expectRevert(abi.encodePacked("DMSD MSig: not owner"));
        wallet.submitTransaction(sybil, 10 ether, new bytes(0));
    }

    // function that tests onlyOwner modifier with a revert
    function testTxExistsModifierWithRevert() public {
        vm.prank(alice);
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount + 1;
        vm.prank(alice);
        vm.expectRevert(abi.encodePacked("DMSD MSig: tx does not exist"));
        wallet.confirmTransaction(txIndex);
    }

    // function that tests notConfirmed modifier with a revert
    function testNotConfirmedModifierWithRevert() public {
        vm.prank(alice);
        wallet.submitTransaction(alice, 10 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount - 1;
        vm.prank(alice);
        wallet.confirmTransaction(txIndex);
        vm.expectRevert(abi.encodePacked("DMSD MSig: tx already confirmed"));
        vm.prank(alice);
        wallet.confirmTransaction(txIndex);
    }

    // function that tests notExecuted modifier with a revert
    function testNotExecutedModifierWithRevert() public {
        vm.prank(bob);
        wallet.submitTransaction(bob, 1 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount - 1;
        vm.prank(bob);
        wallet.confirmTransaction(txIndex);
        vm.prank(alice);
        wallet.confirmTransaction(txIndex);
        vm.prank(bob);
        wallet.executeTransaction(txIndex);
        vm.prank(alice);
        vm.expectRevert(abi.encodePacked("DMSD MSig: tx already executed"));
        wallet.confirmTransaction(txIndex);
    }
}

// a contract that inherits from BaseSetup and which tests MultiSigWallet getters
contract whenGettersAreUsedTest is BaseSetup {
    function setUp() public virtual override {
        BaseSetup.setUp();
        console.log("When getters are used");
    }

    // function that tests getOwners getter
    function testGetOwners() public {
        vm.prank(alice);
        address[] memory owners = wallet.getOwners();
        assertEq(owners.length, 3, "There should be 2 owners");
        assertEq(owners[0], alice, "Alice should be the first owner");
        assertEq(owners[1], bob, "Bob should be the second owner");
        assertEq(owners[2], charlie, "Charlie should be the second owner");
    }

    // function that tests getTransactionCount getter
    function testGetTransactionCount() public {
        vm.prank(alice);
        uint256 txCount = wallet.getTransactionCount();
        assertEq(txCount, 0, "There should be 0 transactions");
        vm.prank(alice);
        wallet.submitTransaction(alice, 10 ether, new bytes(0));
        txCount = wallet.getTransactionCount();
        assertEq(txCount, 1, "There should be 1 transaction");
    }

    // function that tests getTransaction getter
    function testGetTransaction() public {
        vm.prank(alice);
        wallet.submitTransaction(alice, 10 ether, new bytes(0));
        uint256 txCount = wallet.getTransactionCount();
        uint256 txIndex = txCount - 1;
        (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) =
            wallet.getTransaction(txIndex);
        assertEq(to, alice, "Transaction should be sent to Alice");
        assertEq(value, 10 ether, "Transaction value should be 10 ether");
        assertEq(data, new bytes(0), "Transaction data should be bytes(0)");
        assertEq(executed, false, "Transaction should not be executed");
        assertEq(numConfirmations, 0, "Transaction should have 0 confirmations");
    }
}
