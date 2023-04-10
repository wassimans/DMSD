// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {console} from "forge-std/console.sol";
import {Test} from "forge-std/Test.sol";
import "../utils/Utils.sol";
import "../src/MultiSigWallet.sol";
import "../src/DMSD.sol";

abstract contract BaseSetup is Test {
    struct User {
        string email;
        string username;
        bool isRegistered;
        bool isAdmin;
        bool withRecipients;
        bool subscribed;
        uint256 index;
    }

    event LogNewUser(address indexed userAddress, uint256 index, string email);
    event LogDeleteUser(address indexed userAddress, uint256 index, string email);
    event LogNewSubscription(address indexed userAddress);
    event LogNewPersonalMultisig(address[2] indexed recoveryWallets);
    event LogNewRecipientMultisig(address[] indexed owners, uint256 indexed numConfirmationsRequired);
    event Transfer(address indexed from, address indexed to, uint256 value);

    // WMATIC token address in GOERLI testnet
    address public constant WMATIC = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;
    MultiSigWallet internal recipientWallet;
    MultiSigWallet internal personalWallet;
    Utils internal utils;

    User internal admin;
    User internal recipient1;
    User internal recipient2;
    User internal recipient3;
    address payable[] internal testUsers;
    address internal testAdminAddress;
    address internal adminRecoveryAddress1;
    address internal adminRecoveryAddress2;
    address internal alice;
    address internal bob;
    address internal charlie;
    address internal sybil;
    address[] internal recipientMultisigOwners;
    address[] internal personalMultisigOwners;

    function setUp() public virtual {
        utils = new Utils();
        testUsers = utils.createUsers(8);

        // create sample admin account
        admin = User({
            email: "admin@toto.com",
            username: "Admin",
            isRegistered: false,
            isAdmin: true,
            withRecipients: false,
            subscribed: false,
            index: 1
        });

        // create sample recipent accounts
        recipient1 = User({
            email: "alice@toto.com",
            username: "Alice",
            isRegistered: false,
            isAdmin: true,
            withRecipients: false,
            subscribed: false,
            index: 2
        });
        recipient2 = User({
            email: "bob@toto.com",
            username: "Bob",
            isRegistered: false,
            isAdmin: true,
            withRecipients: false,
            subscribed: false,
            index: 3
        });
        recipient3 = User({
            email: "charlie@toto.com",
            username: "Charlie",
            isRegistered: false,
            isAdmin: true,
            withRecipients: false,
            subscribed: false,
            index: 4
        });

        testAdminAddress = testUsers[0];
        vm.label(testAdminAddress, "Admin");
        adminRecoveryAddress1 = testUsers[1];
        vm.label(adminRecoveryAddress1, "RecoveryAddress1");
        adminRecoveryAddress2 = testUsers[2];
        vm.label(adminRecoveryAddress2, "RecoveryAddress2");

        alice = testUsers[4];
        vm.label(alice, "Alice");
        bob = testUsers[5];
        vm.label(bob, "Bob");
        charlie = testUsers[6];
        vm.label(charlie, "Charlie");
        sybil = testUsers[7];
        vm.label(sybil, "Sybil");
        recipientMultisigOwners = new address[](3);
        recipientMultisigOwners[0] = payable(alice);
        recipientMultisigOwners[1] = payable(bob);
        recipientMultisigOwners[2] = payable(charlie);
        recipientWallet = new MultiSigWallet(recipientMultisigOwners, 2);
        // fund the wallet contract with 1 ether for gas consumption
        vm.deal(address(recipientWallet), 1 ether);
        // fund the test contract with 100 ether
        vm.deal(address(this), 1 ether);
    }
}

// a test contract that inherits from BaseSetup and which tests the constructor
contract whenContractIsCreatedTest is BaseSetup {
    DMSD dmsd = new DMSD();

    function setUp() public virtual override {
        BaseSetup.setUp();
        dmsd.setToken(WMATIC);
        console.log("When contract is created test");
    }

    // fucntion that tests DMSD constructor
    function testDMSDConstructor() public {
        console.log("Test DMSD constructor");
        // check if the contract is deployed
        assertTrue(address(this) != address(0));
        // check if the contract is deployed with the correct MATIC token address
        assertTrue(address(dmsd.dToken()) == WMATIC);
    }
}

// a test contract that inherits from BaseSetup and which tests registerAdmin
contract registerAdminTest is BaseSetup {
    DMSD dmsd = new DMSD();
    bool adminCreated;

    function setUp() public virtual override {
        BaseSetup.setUp();
        dmsd.setToken(WMATIC);
        console.log("Register admin test");
    }

    // function that tests registerAdmin
    function testRegisterAdmin() public {
        console.log("Test register admin");
        vm.prank(testAdminAddress);
        adminCreated = dmsd.registerAdmin(admin.email, admin.username);
        // check if the admin is created
        assertTrue(adminCreated);
    }

    // function that tests registerAdmin and cheks all fields are set correctly
    function testRegisterAdminAndCheckFields() public {
        console.log("Test register admin and check fields");
        vm.prank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.username);
        (
            string memory userEmail,
            string memory username,
            bool isAdmin,
            bool isRegistered,
            bool withRecipients,
            bool subscribed
        ) = dmsd.getUser(testAdminAddress);
        // check if the admin is registered
        assertTrue(isRegistered);
        // check if the admin is an admin
        assertTrue(isAdmin);
        // check if the admin has no recipients
        assertTrue(!withRecipients);
        // check if the admin is subscribed
        assertTrue(!subscribed);
        // check if the admin has the correct email
        assertTrue(keccak256(abi.encodePacked(userEmail)) == keccak256(abi.encodePacked(admin.email)));
        // check if the admin has the correct first name
        assertTrue(keccak256(abi.encodePacked(username)) == keccak256(abi.encodePacked(admin.username)));
    }

    // function that tests setAdminAddress
    function testSetAdminAddress() public {
        console.log("Test set admin address");
        vm.prank(alice);
        dmsd.registerAdmin(recipient1.email, recipient1.username);
        assertTrue(dmsd.adminAddress() == alice);
    }
}

// a test contract that inherits from BaseSetup and which tests the subscribeAdmin function
contract subscribeAdminTest is BaseSetup {
    DMSD dmsd = new DMSD();
    bool adminSubscribed;

    function setUp() public virtual override {
        BaseSetup.setUp();
        dmsd.setToken(WMATIC);
        vm.prank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.username);
        console.log("Subscribe admin test");
    }

    // function that tests subscribeAdmin
    function testSubscribeAdmin() public {
        console.log("Test subscribe admin");
        vm.prank(testAdminAddress);
        adminSubscribed = dmsd.subscribeAdmin();
        // check if the admin is subscribed
        assertTrue(adminSubscribed);
    }

    // function that tests subscribeAdmin and cheks all fields are set correctly
    function testSubscribeAdminAndCheckFields() public {
        console.log("Test subscribe admin and check fields");
        vm.prank(testAdminAddress);
        dmsd.subscribeAdmin();
        (
            string memory userEmail,
            string memory username,
            bool isAdmin,
            bool isRegistered,
            bool withRecipients,
            bool subscribed
        ) = dmsd.getUser(testAdminAddress);
        // check if the admin is registered
        assertTrue(isRegistered);
        // check if the admin is an admin
        assertTrue(isAdmin);
        // check if the admin has no recipients
        assertTrue(!withRecipients);
        // check if the admin is subscribed
        assertTrue(subscribed);
        // check if the admin has the correct email
        assertTrue(keccak256(abi.encodePacked(userEmail)) == keccak256(abi.encodePacked(admin.email)));
        // check if the admin has the correct first name
        assertTrue(keccak256(abi.encodePacked(username)) == keccak256(abi.encodePacked(admin.username)));
    }

    // function that tests subscribeAdmin and checks if the admin is already subscribed
    function testSubscribeAdminAndCheckIfAlreadySubscribed() public {
        console.log("Test subscribe admin and check if already subscribed");
        vm.prank(testAdminAddress);
        dmsd.subscribeAdmin();
        // check if the admin is already subscribed
        vm.expectRevert(abi.encodePacked("DMSD: User already subscribed to the service."));
        vm.prank(testAdminAddress);
        dmsd.subscribeAdmin();
    }

    // function to test event emitted LogNewSubscription event after an admin had subscribed
    function testSubscribeAdminAndCheckEvent() public {
        console.log("Test subscribe admin and check event");
        vm.prank(testAdminAddress);
        vm.expectEmit(true, false, false, false);
        emit LogNewSubscription(testAdminAddress);
        dmsd.subscribeAdmin();
    }
}

// a test contract that inherits from BaseSetup and which tests registerRecipient
contract registerRecipientTest is BaseSetup {
    DMSD dmsd = new DMSD();

    bool recipientCreated;

    function setUp() public virtual override {
        BaseSetup.setUp();
        dmsd.setToken(WMATIC);
        vm.prank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.username);
        vm.prank(testAdminAddress);
        recipientCreated = dmsd.registerRecipient(alice, recipient1.email, recipient1.username);
        console.log("Register recipent test");
    }

    // function that tests registerRecipient
    function testRegisterRecipient() public {
        console.log("Test register recipient");
        // check if the recipient is created
        assertTrue(recipientCreated);
    }

    // function that tests registerRecipient and cheks all fields are set correctly
    function testRegisterRecipientAndCheckFields() public {
        console.log("Test register recipient and check fields");
        (
            string memory userEmail,
            string memory username,
            bool isAdmin,
            bool isRegistered,
            bool withRecipients,
            bool subscribed
        ) = dmsd.getUser(alice);
        // check if the admin is registered
        assertTrue(isRegistered);
        // check if the admin is an admin
        assertTrue(!isAdmin);
        // check if the admin has no recipients
        assertTrue(!withRecipients);
        // check if the admin is subscribed
        assertTrue(!subscribed);
        // check if the admin has the correct email
        assertTrue(keccak256(abi.encodePacked(userEmail)) == keccak256(abi.encodePacked(recipient1.email)));
        // check if the admin has the correct first name
        assertTrue(keccak256(abi.encodePacked(username)) == keccak256(abi.encodePacked(recipient1.username)));
    }
}

// a test contract that inherits from BaseSetup and which tests createPersonalMultisig
contract createPersonalMultisigTest is BaseSetup {
    DMSD dmsd = new DMSD();

    function compareArrays(address[2] memory arr1, address[2] memory arr2) internal pure returns (bool) {
        if (arr1.length != arr2.length) {
            return false;
        }
        for (uint256 i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    }

    function setUp() public virtual override {
        BaseSetup.setUp();
        dmsd.setToken(WMATIC);
        vm.prank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.username);
        vm.prank(testAdminAddress);
        dmsd.subscribeAdmin();
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test create personal multisig");
        vm.prank(testAdminAddress);
        dmsd.createPersonalMultisig(testPersonalMultisigOwners);
        deal(address(dmsd.dToken()), testAdminAddress, 100e18);
        console.log("Create personal multisig test");
    }

    // function that tests createPersonalMultisig
    function testCreatePersonalMultisig() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test create personal multisig");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners));
    }

    // function that tests createPersonalMultisig with non admin account
    function testCreatePersonalMultisigWithRevert() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test create personal multisig with non admin account");
        vm.startPrank(alice);
        vm.expectRevert(abi.encodePacked("DMSD: You're not the Admin."));
        dmsd.createPersonalMultisig(testPersonalMultisigOwners);
    }

    // function that tests getRecoveryAddress
    function testGetRecoveryAddress() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test get recovery address");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners));
        vm.prank(testAdminAddress);
        assertTrue(compareArrays(dmsd.getRecoveryWallets(), testPersonalMultisigOwners));
    }

    // fucntion to test LogNewPersonalMultisig event after createRecipientsMultisig
    function testLogNewPersonalMultisigEvent() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test LogNewPersonalMultisig event");
        console.log("Test create recipients multisig");
        vm.prank(testAdminAddress);
        vm.expectEmit(true, false, false, true);
        emit LogNewPersonalMultisig(testPersonalMultisigOwners);
        dmsd.createPersonalMultisig(testPersonalMultisigOwners);
    }

    // function that tests approveTransfer
    function testApproveTransfer() public {
        console.log("Test approve transfer");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.dToken().approve(address(dmsd), testAdminAddress.balance));
    }

    // function that tests transferToMultisig
    function testTransferToMultisig() public {
        console.log("Test transfer to multisig");
        vm.prank(testAdminAddress);
        dmsd.dToken().approve(address(dmsd), testAdminAddress.balance);
        vm.prank(testAdminAddress);
        assertTrue(dmsd.transferToMultisig(10));
    }
}

// a test contract that inherits from BaseSetup and which tests createrecipientsMultisig
contract createRecipientsMultisigTest is BaseSetup {
    DMSD dmsd = new DMSD();

    function setUp() public virtual override {
        BaseSetup.setUp();
        dmsd.setToken(WMATIC);
        vm.startPrank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.username);
        dmsd.subscribeAdmin();
        dmsd.registerRecipient(alice, recipient1.email, recipient1.username);
        dmsd.registerRecipient(bob, recipient2.email, recipient2.username);
        dmsd.registerRecipient(charlie, recipient3.email, recipient3.username);
        dmsd.createRecipientsMultisig(recipientMultisigOwners, 2);
        vm.stopPrank();
        deal(address(dmsd.dToken()), testAdminAddress, 100e18);
        console.log("Create recipients multisig test");
    }

    // function that tests createRecipientsMultisig
    function testCreateRecipientsMultisig() public {
        console.log("Test create recipients multisig");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createRecipientsMultisig(recipientMultisigOwners, 2));
    }

    // fucntion to test LogNewRecipientMultisig event after createRecipientsMultisig
    function testLogNewRecipientMultisigEvent() public {
        console.log("Test LogNewRecipientMultisig event");
        console.log("Test create recipients multisig");
        vm.prank(testAdminAddress);
        vm.expectEmit(true, true, false, true);
        emit LogNewRecipientMultisig(recipientMultisigOwners, 2);
        dmsd.createRecipientsMultisig(recipientMultisigOwners, 2);
    }

    // function that tests approveTransfer
    function testApproveTransfer() public {
        console.log("Test approve transfer");
        vm.startPrank(testAdminAddress);
        assertTrue(dmsd.dToken().approve(address(dmsd), testAdminAddress.balance));
        vm.stopPrank();
    }

    // function that tests transferToMultisig
    function testTransferToMultisig() public {
        console.log("Test transfer to multisig");
        vm.startPrank(testAdminAddress);
        dmsd.dToken().approve(address(dmsd), testAdminAddress.balance);
        assertTrue(dmsd.transferToMultisig(10));
        vm.stopPrank();
    }
}

// a test contract that inherits from BaseSetup and which tests getUserAtIndex, getUser, deleteRecipient
contract getUserAtIndexTest is BaseSetup {
    DMSD dmsd = new DMSD();

    function setUp() public virtual override {
        BaseSetup.setUp();
        dmsd.setToken(WMATIC);
        vm.prank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.username);
        vm.startPrank(testAdminAddress);
        dmsd.registerRecipient(alice, recipient1.email, recipient1.username);
        vm.stopPrank();
        console.log("User management tests");
    }

    // function that tests getUserAtIndex
    function testGetUserAtIndex() public {
        console.log("Test get user at index");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.getUserAtIndex(0) == testAdminAddress);
    }

    // function that tests getUser
    function testGetUser() public {
        console.log("Test get user");
        vm.prank(testAdminAddress);
        (
            string memory userEmail,
            string memory username,
            bool isAdmin,
            bool isRegistered,
            bool withRecipients,
            bool subscribed
        ) = dmsd.getUser(alice);
        // check if the admin is registered
        assertTrue(isRegistered);
        // check if the admin is an admin
        assertTrue(!isAdmin);
        // check if the admin has no recipients
        assertTrue(!withRecipients);
        // check if the admin is subscribed
        assertTrue(!subscribed);
        // check if the admin has the correct email
        assertTrue(keccak256(abi.encodePacked(userEmail)) == keccak256(abi.encodePacked(recipient1.email)));
        // check if the admin has the correct first name
        assertTrue(keccak256(abi.encodePacked(username)) == keccak256(abi.encodePacked(recipient1.username)));
    }
}

// a test contract that inherits from BaseSetup and which tests all DMSD modifiers
contract DMSDModifiersTest is BaseSetup {
    DMSD dmsd = new DMSD();

    function setUp() public virtual override {
        BaseSetup.setUp();
        dmsd.setToken(WMATIC);
        console.log("DMSD modifiers tests");
    }

    // function that tests onlyAdmin modifier
    function testOnlyAdmin() public {
        console.log("Test only admin");
        vm.startPrank(alice);
        vm.expectRevert(abi.encodePacked("DMSD: You're not the Admin."));
        dmsd.registerRecipient(alice, recipient1.email, recipient1.username);
    }

    // function that tests onlySubscribed modifier
    function testOnlySubscribed() public {
        console.log("Test only subscribed");
        vm.startPrank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.username);
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test create personal multisig");
        vm.expectRevert(abi.encodePacked("DMSD: User not subscribed to the service."));
        dmsd.createPersonalMultisig(testPersonalMultisigOwners);
        vm.stopPrank();
    }

    // function that tests onlyRecipient modifier
    function testOnlyUnregistered() public {
        console.log("Test onlyRecipient");
        vm.startPrank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.username);
        dmsd.registerRecipient(alice, recipient1.email, recipient1.username);
        vm.expectRevert(abi.encodePacked("DMSD: You're already a registered user."));
        dmsd.registerRecipient(alice, recipient1.email, recipient1.username);
        vm.stopPrank();
    }

    // function that tests usersNotEmpty modifier
    function testusersNotEmpty() public {
        console.log("Test usersNotEmpty");
        vm.startPrank(alice);
        vm.expectRevert(abi.encodePacked("DMSD: User list is empty"));
        dmsd.getUser(alice);
    }
}
