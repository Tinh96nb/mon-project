const MonMarketPlace = artifacts.require('MonMarketPlace')

module.exports = async function (deployer) {
  await deployer.deploy(MonMarketPlace, "0xFdf7BBdd0231feDE9fc911D5573FC2d3c72373fE", "0x4f4da4221180951e4db5F20840f14882D21f3aE8")
}