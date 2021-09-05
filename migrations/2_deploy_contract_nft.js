const MonNFT = artifacts.require('MonNFT');
const MONToken = artifacts.require('MONToken');
const MonMarketPlace = artifacts.require('MonMarketPlace');

module.exports = async function (deployer) {
  await deployer.deploy(MONToken)
  await deployer.deploy(MonNFT)
  await deployer.deploy(MonMarketPlace, MONToken.address, MonNFT.address)
};