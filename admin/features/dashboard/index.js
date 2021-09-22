const knex = require('../../db/index');

module.exports = router => {
  router.get('/', async (req, res) => {

    const newNFT = await knex('nfts').orderBy('created_at', 'DESC').limit(5);
    const trades = await knex('nft_histories').orderBy('created_at', 'DESC').where({type: 2}).limit(5);

    const totalNFT = await knex('nfts').count('id as amount_nft').sum('price as sumPrice').first();
    const totalusers = await knex('users').count('id as amount_user').first();
    const summary = await knex('nft_histories')
      .where({type: 2})
      .count('id as trade')
      .sum('price as vol')
      .first();

    res.render('pages/dashboard', {
      newNFT,
      trades,
      amountUsers: totalusers.amount_user || 0,
      amountNFTs: totalNFT.amount_nft || 0,
      totalVol: totalNFT.sumPrice || 0,
      amountTrade: summary.trade,
      amountVol: summary.vol,
    })
  });

  return router;
};
