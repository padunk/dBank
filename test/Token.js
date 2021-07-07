const chai = require("chai");
const chaiPromised = require("chai-as-promised");
const { expect } = chai;

chai.use(chaiPromised);

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function () {
    let Token;
    let token;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Token = await ethers.getContractFactory("Token");
        Bank = await ethers.getContractFactory("Bank");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        token = await Token.deploy();
        await token.deployed();

        bank = await Bank.deploy(token.address);
        await bank.deployed();

        // We can interact with the contract by calling `token.method()`
        await token.passMinterRole(bank.address);
    });

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define your
        // tests. It receives the test name, and a callback function.

        // If the callback function is async, Mocha will `await` it.
        it("Should set the right owner", async function () {
            // Expect receives a value, and wraps it in an assertion objet. These
            // objects have a lot of utility methods to assert values.

            // This test expects the owner variable stored in the contract to be equal
            // to our Signer's owner.
            expect(await token.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Token Contract", function () {
        describe("success", () => {
            it("should have correct token name", async () => {
                expect(await token.name()).to.equal(
                    "Decentralized Bank Currency"
                );
            });

            it("should have correct token symbol", async () => {
                expect(await token.symbol()).to.equal("DCB");
            });

            it("should have 0 initial supply", async () => {
                expect(await token.totalSupply()).to.equal(0);
            });

            it("should have token minter role", async () => {
                expect(await token.minter()).to.equal(bank.address);
            });
        });

        describe("failure", () => {
            it("should rejected passing minter role", async () => {
                await expect(
                    token.connect(addr1).passMinterRole(addr1.address)
                ).to.be.revertedWith("caller is not the owner");
            });

            it("should rejected token minting", async () => {
                await expect(
                    token.connect(addr1).mint(addr1.address, 1)
                ).to.be.revertedWith("caller is not the owner");
            });
        });
    });

    // describe("Transactions", function () {
    //     it("Should transfer tokens between accounts", async function () {
    //         // Transfer 50 tokens from owner to addr1
    //         await token.transfer(addr1.address, 50);
    //         const addr1Balance = await token.balanceOf(addr1.address);
    //         expect(addr1Balance).to.equal(50);

    //         // Transfer 50 tokens from addr1 to addr2
    //         // We use .connect(signer) to send a transaction from another account
    //         await token.connect(addr1).transfer(addr2.address, 50);
    //         const addr2Balance = await token.balanceOf(addr2.address);
    //         expect(addr2Balance).to.equal(50);
    //     });

    //     it("Should fail if sender doesn’t have enough tokens", async function () {
    //         const initialOwnerBalance = await token.balanceOf(owner.address);

    //         // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    //         // `require` will evaluate false and revert the transaction.
    //         await expect(
    //             token.connect(addr1).transfer(owner.address, 1)
    //         ).to.be.revertedWith("Not enough tokens");

    //         // Owner balance shouldn't have changed.
    //         expect(await token.balanceOf(owner.address)).to.equal(
    //             initialOwnerBalance
    //         );
    //     });

    //     it("Should update balances after transfers", async function () {
    //         const initialOwnerBalance = await token.balanceOf(owner.address);

    //         // Transfer 100 tokens from owner to addr1.
    //         await token.transfer(addr1.address, 100);

    //         // Transfer another 50 tokens from owner to addr2.
    //         await token.transfer(addr2.address, 50);

    //         // Check balances.
    //         const finalOwnerBalance = await token.balanceOf(owner.address);
    //         expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

    //         const addr1Balance = await token.balanceOf(addr1.address);
    //         expect(addr1Balance).to.equal(100);

    //         const addr2Balance = await token.balanceOf(addr2.address);
    //         expect(addr2Balance).to.equal(50);
    //     });
    // });
});
