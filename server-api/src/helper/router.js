/**
 * * This function create a slug friendily to use in your web application
 * * Compatibility with chinese characters
 * ! Chinese characters doesn't have any modification
 * @param {String} slug
 * @returns {String} cleaned slug
 */
function cleanSlug(slug) {
  slug = slug.replace(/^\s+|\s+$/g, '');
  slug = slug.toLowerCase();

  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaeeeeiiiioooouuuunc------';

  for (let i = 0, l = from.length; i < l; i++) {
    slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  slug = slug
    .normalize('NFD')
    .replace(/[^a-z0-9 -]^[\u4e00-\u9fa5]/g, '') // remove all that not are a letter, a number, and are not a chinese word
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace('-?', '') 
    .replace('?', '');

  return slug;
}

module.exports = {
  cleanSlug,
};
