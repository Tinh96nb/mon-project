const TokenTimelock = artifacts.require('TokenTimelock');

module.exports = async function (deployer) {
  await deployer.deploy(TokenTimelock, "0x73B99c93ac15217B5E52dFBc72506D7ff0A04aEa")
};