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
        bool subscribed;
        uint256 index;
    }

    event LogNewUser(address indexed userAddress, uint256 index, string email);
    event LogNewSubscription(address indexed userAddress);
    event LogDeleteUser(address indexed userAddress, uint256 index, string email);
    event LogNewPersonalMultisig(address[2] indexed recoveryWallets);
    event LogNewTransfer(address indexed from, address indexed to, uint256 amount);
    event LogNewApproval(address indexed from, address indexed to, uint256 amount);
    event Deposit(address indexed sender, uint256 amount, uint256 balance);

    // WMATIC token address in GOERLI testnet
    address public constant WMATIC = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;
    MultiSigWallet internal personalWallet;
    Utils internal utils;

    User internal admin;
    User internal user2;
    User internal user3;
    User internal user1;
    address payable[] internal testUsers;
    address internal testAdminAddress;
    address internal testAdminWalletToProtect;
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
            subscribed: false,
            index: 1
        });

        // create sample recipent accounts
        user1 = User({
            email: "alice@toto.com",
            username: "Alice",
            isRegistered: false,
            isAdmin: true,
            subscribed: false,
            index: 2
        });
        user2 = User({
            email: "bob@toto.com",
            username: "Bob",
            isRegistered: false,
            isAdmin: true,
            subscribed: false,
            index: 3
        });
        user3 = User({
            email: "charlie@toto.com",
            username: "Charlie",
            isRegistered: false,
            isAdmin: true,
            subscribed: false,
            index: 4
        });

        testAdminAddress = testUsers[0];
        vm.label(testAdminAddress, "Admin");
        adminRecoveryAddress1 = testUsers[1];
        vm.label(adminRecoveryAddress1, "RecoveryAddress1");
        adminRecoveryAddress2 = testUsers[2];
        vm.label(adminRecoveryAddress2, "RecoveryAddress2");
        testAdminWalletToProtect = testUsers[3];
        vm.label(testAdminWalletToProtect, "AdminWalletToProtect");

        alice = testUsers[4];
        vm.label(alice, "Alice");
        bob = testUsers[5];
        vm.label(bob, "Bob");
        charlie = testUsers[6];
        vm.label(charlie, "Charlie");
        sybil = testUsers[7];
        vm.label(sybil, "Sybil");
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
        assertTrue(address(dmsd.wmatic()) == WMATIC);
    }
}

// a test contract that inherits from BaseSetup and which tests setToken
contract setTokenTest is BaseSetup {
    DMSD dmsd = new DMSD();

    function setUp() public virtual override {
        BaseSetup.setUp();
        dmsd.setToken(WMATIC);
        console.log("Set token test");
    }

    // function that tests setToken
    function testSetToken() public {
        console.log("Test set token");
        // check if the token is set
        assertTrue(address(dmsd.wmatic()) == WMATIC);
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
        (string memory userEmail, string memory username, bool isAdmin, bool isRegistered, bool subscribed) =
            dmsd.getUser(testAdminAddress);
        // check if the admin is registered
        assertTrue(isRegistered);
        // check if the admin is an admin
        assertTrue(isAdmin);
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
        dmsd.registerAdmin(user1.email, user1.username);
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
        (string memory userEmail, string memory username, bool isAdmin, bool isRegistered, bool subscribed) =
            dmsd.getUser(testAdminAddress);
        // check if the admin is registered
        assertTrue(isRegistered);
        // check if the admin is an admin
        assertTrue(isAdmin);
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

    // function to test onlySubscribed modifier
    function testSubscribeAdminAndCheckOnlySubscribedModifier() public {
        console.log("Test subscribe admin and check only subscribed modifier");
        vm.startPrank(testAdminAddress);
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        // check if the onlySubscribed modifier works
        vm.expectRevert(abi.encodePacked("DMSD: User not subscribed to the service."));
        dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect);
        vm.stopPrank();
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
        console.log("Create personal multisig test");
    }

    // function that tests createPersonalMultisig
    function testCreatePersonalMultisig() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test create personal multisig");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect));
    }

    // function that tests createPersonalMultisig with non admin account
    function testCreatePersonalMultisigWithRevert() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test create personal multisig with non admin account");
        vm.startPrank(alice);
        vm.expectRevert(abi.encodePacked("DMSD: You're not the Admin."));
        dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect);
    }

    // function that tests getRecoveryAddress
    function testGetRecoveryAddress() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test get recovery address");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect));
        vm.prank(testAdminAddress);
        assertTrue(compareArrays(dmsd.getRecoveryWallets(), testPersonalMultisigOwners));
    }

    // function that tests getRecoveryAddress
    function testGetAdminWalletToProtect() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test get wallet to protect address");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect));
        vm.prank(testAdminAddress);
        assertTrue(dmsd.getWalletToProtect() == testAdminWalletToProtect);
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
        dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect);
    }

    // function to test _setRecoveryWallets
    function testSetRecoveryWallets() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test set recovery wallets");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect));
        vm.prank(testAdminAddress);
        assertTrue(compareArrays(dmsd.getRecoveryWallets(), testPersonalMultisigOwners));
    }

    // function to test _setWalletToProtect
    function testSetWalletToProtect() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test set wallet to protect");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect));
        vm.prank(testAdminAddress);
        assertTrue(dmsd.getWalletToProtect() == testAdminWalletToProtect);
    }

    // function to test _setIsWalletToProtect
    function testSetIsWalletToProtect() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test set is wallet to protect");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect));
        vm.prank(testAdminAddress);
        assertTrue(dmsd.getIsWalletToProtect(testAdminWalletToProtect));
    }

    // function to test getIsWalletToProtect
    function testGetIsWalletToProtect() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test get is wallet to protect");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect));
        vm.prank(testAdminAddress);
        assertTrue(dmsd.getIsWalletToProtect(testAdminWalletToProtect));
    }

    // function to test getPersonalMultiSigBalance
    function testGetPersonalMultiSigBalance() public {
        address[2] memory testPersonalMultisigOwners;
        testPersonalMultisigOwners[0] = payable(adminRecoveryAddress1);
        testPersonalMultisigOwners[1] = payable(adminRecoveryAddress2);
        console.log("Test get personal multisig balance");
        vm.prank(testAdminAddress);
        assertTrue(dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect));
        vm.prank(testAdminAddress);
        assertTrue(dmsd.getPersonalMultiSigBalance() == 0);
    }
}

// a test contract that inherits from BaseSetup and which tests dmsd.approveTransfer
contract ApproveTransferTest is BaseSetup {
    DMSD dmsd = new DMSD();

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
        vm.prank(testAdminAddress);
        dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect);
        console.log("Transfer from to multisig test");
    }

    // function that tests approveTransfer
    function testApproveTransfer() public {
        console.log("Test transfer from to multisig");
        deal(address(WMATIC), testAdminWalletToProtect, 10000e18);
        vm.prank(testAdminWalletToProtect);
        assertTrue(IERC20(WMATIC).approve(address(dmsd), 100e18));
    }

    // function that tests approveTransfer with non onlyWalletToProtect
    function testApproveTransferWithRevert() public {
        console.log("Test transfer from to multisig with non onlyWalletToProtect");
        deal(address(WMATIC), testAdminWalletToProtect, 10000e18);
        vm.startPrank(alice);
        vm.expectRevert(abi.encodePacked("DMSD: This is not a wallet to protect."));
        dmsd.approveTransfer();
    }

    // fucntion to test LogTransferApproved event after approveTransfer
    function testLogTransferApprovedEvent() public {
        console.log("Test LogTransferApproved event");
        deal(address(WMATIC), testAdminWalletToProtect, 10000e18);
        vm.prank(testAdminWalletToProtect);
        vm.expectEmit(true, false, false, true);
        emit LogNewApproval(testAdminWalletToProtect, address(dmsd), 100e18);
        dmsd.approveTransfer();
    }

    // fucntion to test getApprovals
    function testGetApprovals() public {
        console.log("Test get approvals");
        deal(address(WMATIC), testAdminWalletToProtect, 10000e18);
        vm.prank(testAdminWalletToProtect);
        dmsd.approveTransfer();
        vm.prank(testAdminAddress);
        assertTrue(dmsd.getApprovals());
    }

    // fucntion to test getApprovalsFromWalletToProtect
    function testGetApprovalsFromWalletToProtect() public {
        console.log("Test get approvals from wallet to protect");
        deal(address(WMATIC), testAdminWalletToProtect, 10000e18);
        vm.prank(testAdminWalletToProtect);
        dmsd.approveTransfer();
        vm.prank(testAdminWalletToProtect);
        assertTrue(dmsd.getApprovalsFromWalletToProtect());
    }
}

// a test contract that inherits from BaseSetup and which tests dmsd.transferFromToMultisig
contract TransferFromToMultisigTest is BaseSetup {
    DMSD dmsd = new DMSD();

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
        vm.prank(testAdminAddress);
        dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect);
        console.log("Transfer from to multisig test");
    }

    // function that tests transferFromToMultisig
    function testTransferFromToMultisig() public {
        console.log("Test transfer from to multisig");
        vm.prank(testAdminWalletToProtect);
        IERC20(WMATIC).approve(address(dmsd), 10000e18);
        deal(address(WMATIC), testAdminWalletToProtect, 10000e18);
        vm.prank(testAdminAddress);
        assertTrue(dmsd.transferFromToMultisig(1000000000000000000));
    }

    // function that tests transferFromToMultisig with non admin account
    function testTransferFromToMultisigWithRevert() public {
        console.log("Test transfer from to multisig with non admin account");
        vm.startPrank(alice);
        vm.expectRevert(abi.encodePacked("DMSD: You're not the Admin."));
        dmsd.transferFromToMultisig(1000000000000000000);
    }

    // function to test getTransfers
    function testGetTransfers() public {
        console.log("Test get transfers");
        vm.prank(testAdminWalletToProtect);
        IERC20(WMATIC).approve(address(dmsd), 10000e18);
        deal(address(WMATIC), testAdminWalletToProtect, 10000e18);
        vm.prank(testAdminAddress);
        dmsd.transferFromToMultisig(1000000000000000000);
        vm.prank(testAdminAddress);
        assertTrue(dmsd.getTransfers());
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
        dmsd.getRecoveryWallets();
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
        dmsd.createPersonalMultisig(testPersonalMultisigOwners, testAdminWalletToProtect);
        vm.stopPrank();
    }

    // function that tests onlyRecipient modifier
    function testOnlyUnregistered() public {
        console.log("Test onlyRecipient");
        vm.startPrank(testAdminAddress);
        dmsd.registerAdmin(admin.email, admin.username);
        vm.expectRevert(abi.encodePacked("DMSD: You're already a registered user."));
        dmsd.registerAdmin(admin.email, admin.username);
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
