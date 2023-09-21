import {expect} from "chai";
import { ethers } from "hardhat";

describe("hachiToken Contract", function () {

  let hachiToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    hachiToken = await ethers.getContractFactory("hachiToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hachiToken = await hachiToken.deploy();
    await hachiToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hachiToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hachiToken.balanceOf(owner.address);
      expect(await hachiToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await hachiToken.sendTo(addr1.address, 50);
      const addr1Balance = await hachiToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await hachiToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hachiToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hachiToken.balanceOf(owner.address);

      await expect(
        hachiToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await hachiToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hachiToken.balanceOf(owner.address);

      await hachiToken.sendTo(addr1.address, 100);
      await hachiToken.sendTo(addr2.address, 50);

      const finalOwnerBalance = await hachiToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await hachiToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hachiToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
