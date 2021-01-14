global.__basedir = __dirname;
const config = require('./config/config');
const globalErrorHandler = require('./global-error-handler')

const app = require('express')();

require('./config/express')(app);
require('./config/routes')(app);
const dbConnectionPromise = require('./config/database')(config.dbConnectionString);

dbConnectionPromise.then(() => {
    app.use(globalErrorHandler);
    app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
})

