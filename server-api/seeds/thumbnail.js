const path = require('path');
const { optimizeImage } = require("../src/helper");

exports.seed = async function (knex) {
  async function* getNfts() {
    const nfts = await knex.select()
      .from('nfts')
      .where('mine_type', "like", 'image/%')
      .whereNot('mine_type', 'image/gif');
    for (let i = 0; i < nfts.length; i += 1) {
      yield nfts[i];
    }
  }

  const nfts = getNfts();
  while (true) {
    let gen = await nfts.next();
    if (gen.done) {
      break;
    }
    const nft = gen.value;
    if (nft.media) {
      console.log(nft.media);
      try {
        const thumbnailPath = await optimizeImage({
          imgPath: path.resolve(__dirname + "/../public/upload" + nft.media),
          imgFileName: nft.media,
        });
        await knex('nfts')
          .where('id', nft.id)
          .update({ thumbnail: thumbnailPath })
        console.log(nft.media, 'success');
      } catch (error) {
        console.log(error);
      }
    }
  }
  console.log("Done");
};
