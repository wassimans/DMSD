// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {console} from "forge-std/console.sol";
import {stdStorage, StdStorage, Test} from "forge-std/Test.sol";
import "../utils/Utils.sol";
import "../src/MultiSigWallet.sol";
import "../src/DMSD.sol";

abstract contract BaseSetup is DMSD, Test {
    // DAI token address in GOERLI testnet
    address public constant DAI = 0x73967c6a0904aA032C103b4104747E88c566B1A2;
    MultiSigWallet internal wallet;
    Utils internal utils;

    User internal admin;
    User internal recipient1;
    User internal recipient2;
    User internal recipient3;
    address payable[] internal testUsers;
    address internal testAdminAddress;
    address internal adminRecoveryAddress;
    address internal alice;
    address internal bob;
    address internal charlie;
    address internal sybil;
    address[] internal multisigOwners;

    // constructor
    constructor() DMSD(DAI) {
        console.log("Base setup constructor");
    }

    // function writeTokenBalance(address who, uint256 amt) internal {
    //     stdstore.target(address(this)).sig(IERC20(DAI).balanceOf.selector).with_key(who).checked_write(amt);
    // }

    function setUp() public virtual {
        utils = new Utils();
        testUsers = utils.createUsers(6);

        // create sample admin account
        admin = User({
            email: "admin@toto.com",
            firstName: "Admin",
            lastName: "Admin",
            isRegistered: false,
            isAdmin: true,
            withRecipients: false,
            index: 1
        });

        // create sample recipent accounts
        recipient1 = User({
            email: "alice@toto.com",
            firstName: "Alice",
            lastName: "Doe",
            isRegistered: false,
            isAdmin: true,
            withRecipients: false,
            index: 2
        });
        recipient2 = User({
            email: "bob@toto.com",
            firstName: "Bob",
            lastName: "Doe",
            isRegistered: false,
            isAdmin: true,
            withRecipients: false,
            index: 3
        });
        recipient3 = User({
            email: "charlie@toto.com",
            firstName: "Charlie",
            lastName: "Doe",
            isRegistered: false,
            isAdmin: true,
            withRecipients: false,
            index: 4
        });

        testAdminAddress = testUsers[0];
        vm.label(testAdminAddress, "Admin");
        // writeTokenBalance(address(this), address(DAI), 1_000_000_000 * 1e18);
        adminRecoveryAddress = testUsers[1];
        vm.label(adminRecoveryAddress, "RecoveryAddress");

        alice = testUsers[2];
        vm.label(alice, "Alice");
        bob = testUsers[3];
        vm.label(bob, "Bob");
        charlie = testUsers[4];
        vm.label(charlie, "Charlie");
        sybil = testUsers[5];
        vm.label(sybil, "Sybil");
        multisigOwners = new address[](3);
        multisigOwners[0] = payable(alice);
        multisigOwners[1] = payable(bob);
        multisigOwners[2] = payable(charlie);
        wallet = new MultiSigWallet(multisigOwners, 2);
        // fund the wallet contract with 1 ether for gas consumption
        vm.deal(address(wallet), 1 ether);
        // fund the test contract with 100 ether
        vm.deal(address(this), 1 ether);
    }
}

// a test contract that inherits from BaseSetup and which tests the constructor
contract whenContractIsCreatedTest is BaseSetup {
    DMSD dmsd = new DMSD(DAI);

    function setUp() public virtual override {
        BaseSetup.setUp();
        console.log("When contract is created test");
    }

    // fucntion that tests DMSD constructor
    function testDMSDConstructor() public {
        console.log("Test DMSD constructor");
        // check if the contract is deployed
        assertTrue(address(this) != address(0));
        // check if the contract is deployed with the correct MATIC token address
        assertTrue(address(dmsd.dToken()) == DAI);
    }
}

// a test contract that inherits from BaseSetup and which tests registerAdmin
contract registerAdminTest is BaseSetup {
    DMSD dmsd = new DMSD(DAI);
    bool adminCreated;

    function setUp() public virtual override {
        BaseSetup.setUp();
        console.log("Register admin test");
    }

    // function that tests registerAdmin
    function testRegisterAdmin() public {
        console.log("Test register admin");
        vm.prank(testAdminAddress);
        adminCreated = dmsd.registerAdmin(admin.email, admin.firstName, admin.lastName);
        // check if the admin is created
        assertTrue(adminCreated);
    }

    // function that tests registerAdmin and cheks all fields are set correctly
    function testRegisterAdminAndCheckFields() public {
        console.log("Test register admin and check fields");
        vm.prank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.firstName, admin.lastName);
        (
            string memory userEmail,
            string memory firstName,
            string memory lastName,
            bool isAdmin,
            bool isRegistered,
            bool withRecipients
        ) = dmsd.getUser(testAdminAddress);
        // check if the admin is registered
        assertTrue(isRegistered);
        // check if the admin is an admin
        assertTrue(isAdmin);
        // check if the admin has no recipients
        assertTrue(!withRecipients);
        // check if the admin has the correct email
        assertTrue(keccak256(abi.encodePacked(userEmail)) == keccak256(abi.encodePacked(admin.email)));
        // check if the admin has the correct first name
        assertTrue(keccak256(abi.encodePacked(firstName)) == keccak256(abi.encodePacked(admin.firstName)));
        // check if the admin has the correct last name
        assertTrue(keccak256(abi.encodePacked(lastName)) == keccak256(abi.encodePacked(admin.lastName)));
    }

    // function that tests setAdminAddress
    function testSetAdminAddress() public {
        console.log("Test set admin address");
        vm.prank(alice);
        dmsd.registerAdmin(recipient1.email, recipient1.firstName, recipient1.lastName);
        assertTrue(dmsd.adminAddress() == alice);
    }
}

// a test contract that inherits from BaseSetup and which tests registerRecipient
contract registerRecipientTest is BaseSetup {
    DMSD dmsd = new DMSD(DAI);

    bool recipientCreated;

    function setUp() public virtual override {
        BaseSetup.setUp();
        vm.prank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.firstName, admin.lastName);
        vm.prank(testAdminAddress);
        recipientCreated = dmsd.registerRecipient(alice, recipient1.email, recipient1.firstName, recipient1.lastName);
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
            string memory firstName,
            string memory lastName,
            bool isAdmin,
            bool isRegistered,
            bool withRecipients
        ) = dmsd.getUser(alice);
        // check if the admin is registered
        assertTrue(isRegistered);
        // check if the admin is an admin
        assertTrue(!isAdmin);
        // check if the admin has no recipients
        assertTrue(!withRecipients);
        // check if the admin has the correct email
        assertTrue(keccak256(abi.encodePacked(userEmail)) == keccak256(abi.encodePacked(recipient1.email)));
        // check if the admin has the correct first name
        assertTrue(keccak256(abi.encodePacked(firstName)) == keccak256(abi.encodePacked(recipient1.firstName)));
        // check if the admin has the correct last name
        assertTrue(keccak256(abi.encodePacked(lastName)) == keccak256(abi.encodePacked(recipient1.lastName)));
    }
}

// a test contract that inherits from BaseSetup and which tests createPersonalMultisig
contract createPersonalMultisigTest is BaseSetup {
    DMSD dmsd = new DMSD(DAI);

    function setUp() public virtual override {
        BaseSetup.setUp();
        vm.prank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.firstName, admin.lastName);
        console.log("Create personal multisig test");
    }

    // function that tests createPersonalMultisig
    function testCreatePersonalMultisig() public {
        console.log("Test create personal multisig");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(adminRecoveryAddress));
    }

    // function that tests createPersonalMultisig with non admin account
    function testCreatePersonalMultisigWithRevert() public {
        console.log("Test create personal multisig with non admin account");
        vm.startPrank(alice);
        vm.expectRevert(abi.encodePacked("DMSD: You're not the Admin."));
        dmsd.createPersonalMultisig(adminRecoveryAddress);
    }

    // function that tests getRecoveryAddress
    function testGetRecoveryAddress() public {
        console.log("Test get recovery address");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(alice));
        vm.prank(testAdminAddress);
        assertTrue(dmsd.getRecoveryAddress() == alice);
    }

    // fucntion to test LogNewPersonalMultisig event after createRecipientsMultisig
    function testLogNewPersonalMultisigEvent() public {
        console.log("Test LogNewPersonalMultisig event");
        console.log("Test create recipients multisig");
        vm.prank(testAdminAddress);
        vm.expectEmit(true, false, false, true);
        emit LogNewPersonalMultisig(adminRecoveryAddress);
        dmsd.createPersonalMultisig(adminRecoveryAddress);
    }
}

// a test contract that inherits from BaseSetup and which tests createrecipientsMultisig
contract createRecipientsMultisigTest is BaseSetup {
    DMSD dmsd = new DMSD(DAI);

    function setUp() public virtual override {
        BaseSetup.setUp();
        vm.startPrank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.firstName, admin.lastName);
        dmsd.registerRecipient(alice, recipient1.email, recipient1.firstName, recipient1.lastName);
        dmsd.registerRecipient(bob, recipient2.email, recipient2.firstName, recipient2.lastName);
        dmsd.registerRecipient(charlie, recipient3.email, recipient3.firstName, recipient3.lastName);
        dmsd.createRecipientsMultisig(multisigOwners, 2);
        vm.stopPrank();
        deal(address(dToken), testAdminAddress, 100e18);
        console.log("Create recipients multisig test");
    }

    // function that tests createRecipientsMultisig
    function testCreateRecipientsMultisig() public {
        console.log("Test create recipients multisig");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createRecipientsMultisig(multisigOwners, 2));
    }

    // fucntion to test LogNewRecipientMultisig event after createRecipientsMultisig
    function testLogNewRecipientMultisigEvent() public {
        console.log("Test LogNewRecipientMultisig event");
        console.log("Test create recipients multisig");
        vm.prank(testAdminAddress);
        vm.expectEmit(true, true, false, true);
        emit LogNewRecipientMultisig(multisigOwners, 2);
        dmsd.createRecipientsMultisig(multisigOwners, 2);
    }

    // function that tests approveTransfer
    function testApproveTransfer() public {
        console.log("Test approve transfer");
        vm.startPrank(testAdminAddress);
        assertTrue(dToken.approve(address(dmsd), testAdminAddress.balance));
        vm.stopPrank();
    }

    // function that tests transferToMultisig
    function testTransferToMultisig() public {
        console.log("Test transfer to multisig");
        // uint256 slot = stdstore.target(address(this)).sig(token.balanceOf.selector).with_key(testAdminAddress).find();
        // bytes32 data = vm.load(address(this), bytes32(slot));
        // stdstore.target(address(this)).sig(dmsd.token.balanceOf.selector).with_key(testAdminAddress).checked_write(
        //     1_000_000_000 * 1e18
        // );
        vm.startPrank(testAdminAddress);
        dToken.approve(address(dmsd), testAdminAddress.balance);
        assertTrue(dmsd.transferToMultisig(10));
        vm.stopPrank();
    }
}

// a test contract that inherits from BaseSetup and which tests getUserAtIndex, getUser, deleteRecipient
contract getUserAtIndexTest is BaseSetup {
    DMSD dmsd = new DMSD(DAI);

    function setUp() public virtual override {
        BaseSetup.setUp();
        vm.prank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.firstName, admin.lastName);
        vm.startPrank(testAdminAddress);
        dmsd.registerRecipient(alice, recipient1.email, recipient1.firstName, recipient1.lastName);
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
            string memory firstName,
            string memory lastName,
            bool isAdmin,
            bool isRegistered,
            bool withRecipients
        ) = dmsd.getUser(alice);
        // check if the admin is registered
        assertTrue(isRegistered);
        // check if the admin is an admin
        assertTrue(!isAdmin);
        // check if the admin has no recipients
        assertTrue(!withRecipients);
        // check if the admin has the correct email
        assertTrue(keccak256(abi.encodePacked(userEmail)) == keccak256(abi.encodePacked(recipient1.email)));
        // check if the admin has the correct first name
        assertTrue(keccak256(abi.encodePacked(firstName)) == keccak256(abi.encodePacked(recipient1.firstName)));
        // check if the admin has the correct last name
        assertTrue(keccak256(abi.encodePacked(lastName)) == keccak256(abi.encodePacked(recipient1.lastName)));
    }
}

// a test contract that inherits from BaseSetup and which tests all DMSD modifiers
contract DMSDModifiersTest is BaseSetup {
    DMSD dmsd = new DMSD(DAI);

    function setUp() public virtual override {
        BaseSetup.setUp();
        console.log("DMSD modifiers tests");
    }

    // function that tests onlyAdmin modifier
    function testOnlyAdmin() public {
        console.log("Test only admin");
        vm.startPrank(alice);
        vm.expectRevert(abi.encodePacked("DMSD: You're not the Admin."));
        dmsd.registerRecipient(alice, recipient1.email, recipient1.firstName, recipient1.lastName);
    }

    // function that tests onlyRecipient modifier
    function testOnlyUnregistered() public {
        console.log("Test onlyRecipient");
        vm.startPrank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.firstName, admin.lastName);
        dmsd.registerRecipient(alice, recipient1.email, recipient1.firstName, recipient1.lastName);
        vm.expectRevert(abi.encodePacked("DMSD: You're already a registered user."));
        dmsd.registerRecipient(alice, recipient1.email, recipient1.firstName, recipient1.lastName);
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
