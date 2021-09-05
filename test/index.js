const MONToken = artifacts.require('MONToken')
const MonNFT = artifacts.require('MonNFT')
const MonMarketPlace = artifacts.require('MonMarketPlace')

let token, nft, martket;
contract('contract stake', (accounts) => {
  const owner = accounts[0];
  const seller = accounts[1]
  const buyer = accounts[2];
  const bal = 1000;
  const tokenid = 5;

  beforeEach(async () => {
    token = await MONToken.new({ from: owner });
    nft = await MonNFT.new({ from: owner });
    martket = await MonMarketPlace.new(token.address, nft.address, { from: owner });
    // set balance and approve
    await token.mint(buyer, bal, { from: owner });
    await token.approve(martket.address, 1000, { from: buyer });
    await nft.setApprovalForAll(martket.address, true, { from: seller });
    // create nft
    await nft.mintToken(tokenid, 'metadata', { from: seller })
    await martket.setFeePercent(5000, { from: owner })
  })

  it('check balance init earch user and stage', async () => {
    const resBal = await token.balanceOf(buyer);
    assert.strictEqual(resBal.toNumber(), bal);
    await martket.createSellOrder(tokenid, 100, { from: seller });
    await martket.purchase(tokenid, { from: buyer });
    const buyerbl = await token.balanceOf(buyer);
    const selbl = await token.balanceOf(seller);
    console.log(buyerbl.toNumber(), selbl.toNumber());
    const addressowen = await nft.ownerOf(tokenid);
    console.log(addressowen);

  })
})