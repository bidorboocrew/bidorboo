// central location to populate all our routes
const requireBidorBooHost = require('../middleware/requireBidorBooHost');

module.exports = (app) => {
  // make sure we only accept reqs from our site domain
  app.all('*', requireBidorBooHost);
  // instantiate app routes
  require('../routes/authRoutes')(app);
  require('../routes/userRoutes')(app);
  require('../routes/requestRoutes')(app);
  require('../routes/reviewRoutes')(app);
  require('../routes/bidRoutes')(app);
  require('../routes/paymentRoutes')(app);
  require('../routes/pushNotificationRoutes')(app);
};
