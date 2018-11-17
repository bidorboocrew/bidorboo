// central location to populate all our routes

module.exports = app => {
  // instantiate app routes
  require('../routes/authRoutes')(app);
  require('../routes/userRoutes')(app);
  require('../routes/jobRoutes')(app);
  require('../routes/bidRoutes')(app);
  require('../routes/paymentRoutes')(app);

};
