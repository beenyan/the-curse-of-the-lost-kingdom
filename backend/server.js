const fs = require('fs');
const https = require('https');
const ip = require('ip');
const ipAddress = ip.address();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const moment = require('moment');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 443;

const db = require('../backend/connect');
const manageRouter = require('./routes/manage');
const apiRouter = require('./routes/api');
const sessionStore = new MySQLStore({}, db);

app.use(compression()); // 壓縮所有 routor
app.use('/assets', express.static('dist/assets'));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: 'passwordhashdontlookit',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'strict',
    },
    store: sessionStore,
  })
);
const corsOptions = {
  origin: function (origin, callback) {
    if ('https://pandayoooo.github.io' === origin) {
      return callback(null, true);
    }
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const msg = `[${time}] ${origin} Not allowed by CORS\n`;
    fs.appendFile('./logs/error.log', msg, (err) => err);
    callback(msg);
  },
};
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' });
app.use(
  morgan(':remote-addr [:date[clf]] :method :status :response-time[3] ms "[HTTP::http-version] :url"', {
    stream: accessLogStream,
  })
);
app.use(express.json());
// app.use('/api/', cors(corsOptions));

app.use('/manageapi', manageRouter);
app.use('/api', apiRouter);
app.use((req, res) => {
  res.status(200).sendFile('/dist/index.html', { root: process.cwd() });
});

const options = {
  key: fs.readFileSync('./key/key.pem', 'utf8'),
  cert: fs.readFileSync('./key/cert.pem', 'utf8'),
};

https.createServer(options, app).listen(port, () => {
  console.log(`\n[Localhost] https://127.0.0.1:${port}`);
  console.log(`[IPV4] https://${ipAddress}:${port}`);
});
