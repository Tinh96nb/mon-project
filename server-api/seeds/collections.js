const {cleanSlug} = require('../src/helper/router');

exports.seed = function (knex) {
  return knex('collections').insert([
    {
      name: 'Collection 1',
      description: 'Collection 1',
      img_avatar_url: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/background-1837375_960_720.jpg',
      img_cover_url: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/background-1837375_960_720.jpg',
      slug: cleanSlug('Collection 1'),
      user_id: 15,
    },
    {
      name: 'Collection 2',
      description: 'Collection 2',
      img_avatar_url: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/background-1837375_960_720.jpg',
      img_cover_url: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/background-1837375_960_720.jpg',
      slug: cleanSlug('Collection 2'),
      user_id: 15,
    },
    {
      name: 'Collection 3',
      description: 'Collection 3',
      img_avatar_url: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/background-1837375_960_720.jpg',
      img_cover_url: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/background-1837375_960_720.jpg',
      user_id: 25,
      slug: cleanSlug('Collection 3'),
    },
    {
      name: 'Collection 4', 
      description: 'Collection 4',
      img_avatar_url: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/background-1837375_960_720.jpg',
      img_cover_url: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/background-1837375_960_720.jpg',
      user_id: 25,
      slug: cleanSlug('Collection 4'),
    },
  ]);
};
