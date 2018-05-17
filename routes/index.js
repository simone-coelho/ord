const routes = require('express').Router();
const config = require('../config/config');

// Routers
const authRouter = require('../routes/authentication/index');
const projectsRouter = require('../routes/projects/index');
const experimentsRouter = require('../routes/experiments/index');
const updateAttributesRouter = require('../routes/update_attributes/index');

// Routes
routes.use('/api/v2/auth', authRouter);
routes.use('/api/v2/projects', projectsRouter);
routes.use('/api/v2/experiments', experimentsRouter);
routes.use('/api/v2/update_attributes', updateAttributesRouter);

routes.get('/', (req, res) => {
  // res.status(200).json({ message: 'Express Server Connected: ' + config.loggerDate()});
  res.render('home');
});

module.exports = routes;