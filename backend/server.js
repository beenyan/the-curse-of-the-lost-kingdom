const https = require('https');
const ip = require('ip');
const ipAddress = ip.address();
const express = require('express');
const compression = require('compression');
const dotenv = require('dotenv');
const config = require('./config');
const { default: helmet } = require('helmet');

dotenv.config();
const app = express();
const port = process.env.PORT || 443;

const manageRouter = require('./routes/manage');
const apiRouter = require('./routes/api');
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(config.session);
// app.use('/api/', config.corsOptions);
app.use(compression()); // 壓縮所有 routor
app.use('/assets', express.static('dist/assets'));
app.use('/favicon.ico', express.static('dist/favicon.ico'));
app.use('/user/static', express.static('user/static/'));
app.use('/user', express.static('user/'));
app.use(express.urlencoded({ extended: true }));
app.use(config.morgan);
app.use(express.json());
app.use('/manageapi', manageRouter);
app.use('/api', apiRouter);
app.use((req, res) => {
  res.status(200).sendFile('/dist/index.html', { root: process.cwd() });
});
app.use(config.errorHandler);

https.createServer(config.createServerOptions, app).listen(port, () => {
  console.log(`\n> Local:    https://127.0.0.1:${port}`);
  console.log(`> IPV4:     https://${ipAddress}:${port}`);
});
