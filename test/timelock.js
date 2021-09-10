const MONToken = artifacts.require('MONToken')
const TokenTimelock = artifacts.require('TokenTimelock')
const { time } = require("@openzeppelin/test-helpers");

let token, tokenLock;
contract('contract stake', (accounts) => {
  const owner = accounts[0];
  const userlock = accounts[1]
  const amountLock = 2000;

  beforeEach(async () => {
    token = await MONToken.new({ from: owner });
    tokenLock = await TokenTimelock.new(token.address, { from: owner });
    // set balance and approve
    await token.mint(owner, amountLock, { from: owner });
    await token.approve(tokenLock.address, amountLock, { from: owner });
  })

  it('check balance init earch user and stage', async () => {
    const balock = await token.balanceOf(userlock);
    assert.strictEqual(balock.toNumber(), 0);
    await tokenLock.setLock(userlock, 1000, '1631184300',{ from: owner });
    // const pushTime = 5;
    // await time.increase(time.duration.minutes(pushTime))
    await tokenLock.release({ from: userlock });
    const balockRes = await token.balanceOf(userlock);
    console.log(balockRes.toNumber());
    const ownerBal = await token.balanceOf(owner);
    console.log(ownerBal.toNumber());

    // await tokenLock.setLock(userlock, 500, '1631184300',{ from: owner });
    // const res = await tokenLock.lockAmount(userlock);
    // console.log(res.toNumber());
  })
})