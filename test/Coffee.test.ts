import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BuyMeACoffee", function() {

    async function deployBuyMeACoffee() {
        
        const [owner, user] = await ethers.getSigners();
        const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
        const buyCoffee = await BuyMeACoffee.deploy();
        await buyCoffee.deployed();

        return { buyCoffee, owner, user };
    }

    describe("Deploy", function() {
        
        it("Should set the right owner", async function () {
            const { buyCoffee, owner } = await loadFixture(deployBuyMeACoffee);
            expect(await buyCoffee.owner()).to.equal(owner.address);
        });

    });

    describe("tipsCoffee", function () {

        it("Should revert with invalid id", async function() {
            const { buyCoffee, user } = await loadFixture(deployBuyMeACoffee);
            await expect(buyCoffee.connect(user).tipCoffee(10)).to.be.revertedWith("Id: not found");            
        });

    });

    describe("CreateUsers && tipCoffee", function() {

        it("Should revert with name is null", async function() {
            const { buyCoffee, owner } = await loadFixture(deployBuyMeACoffee);
            await expect(buyCoffee.connect(owner).createUser("", "Description", "Url Imagen", owner.address)).to.be.revertedWith("Name is null");
        });

        it("Should revert with description is null", async function() {
            const { buyCoffee, owner } = await loadFixture(deployBuyMeACoffee);
            await expect(buyCoffee.connect(owner).createUser("Name", "", "Url Imagen", owner.address)).to.be.revertedWith("Description is null");
        });

        it("Should revert with URL Imagen is null", async function() {
            const { buyCoffee, owner } = await loadFixture(deployBuyMeACoffee);
            await expect(buyCoffee.connect(owner).createUser("Name", "Description", "", owner.address)).to.be.revertedWith("Image URL is null");
        });

        it("Should create user and emit event", async function() {
            const { buyCoffee, owner } = await loadFixture(deployBuyMeACoffee);
            await expect(buyCoffee.connect(owner).createUser("Samu", "Web3 Developer", "https://samuel.com", owner.address)).to.emit(buyCoffee,
            "ClientCreated(uint256 indexed userId, string _name, string _description, string _urlImg, address payable wallet)");
        });

        it("Should tip user", async function() {
            const { buyCoffee, owner, user} = await loadFixture(deployBuyMeACoffee);
            await expect(buyCoffee.connect(owner).createUser("Samu", "Web3 Developer", "https://samuel.com", owner.address)).to.be.not.reverted;
            const balanceBefore = await ethers.provider.getBalance(owner.address);
            await buyCoffee.connect(user).tipCoffee(0, {value: ethers.utils.parseEther("1.0")});
            const balanceAfter = await ethers.provider.getBalance(owner.address);
            expect(balanceBefore).to.be.lessThan(balanceAfter);
        });

    });

});