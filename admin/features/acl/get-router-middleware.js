module.exports = mixAllRouter = router => (req, res, next) => {
  const routers = router.stack
    .filter(r => r.route)
    .map(r => {
      return {
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        path: r.route.path,
      };
    });
  res.locals.routers = routers;
  return next();
}
