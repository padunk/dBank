// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  console.log("Token address:", token.address);

  const Bank = await ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();
  await bank.deployed();

  console.log("Bank address:", bank.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token, 'Token');
  saveFrontendFiles(bank, 'Bank');

  try {
    await token.passMinterRole(bank.address);
  } catch (error) {
    console.log(error);
  }
}

function saveFrontendFiles(token, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const existingFile = JSON.parse(fs.readFileSync(contractsDir + "/contract-address.json", {encoding: 'utf-8'}))

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ ...existingFile, [name]: token.address }, undefined, 2)
  );

  const Artifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(Artifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
