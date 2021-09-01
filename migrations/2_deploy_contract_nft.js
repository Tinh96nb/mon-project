const MonNFT = artifacts.require('MonNFT');
const MONToken = artifacts.require('MONToken');

module.exports = async function (deployer) {
  await deployer.deploy(MONToken)
  await deployer.deploy(MonNFT)
};