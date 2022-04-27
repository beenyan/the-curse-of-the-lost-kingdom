const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const moment = require('moment');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const db = require('./connect');
const sessionStore = new MySQLStore({}, db);
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(__dirname, '/logs/error.log'), { flags: 'a' });
errorLogStream.writeLine = function (msg) {
  this.write(`${msg}\r\n`);
};

const config = {
  session: session({
    secret: 'passwordhashdontlookit',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'strict',
    },
    store: sessionStore,
  }),
  corsOptions: cors({
    origin: function (origin, callback) {
      if ('https://36.232.49.211:440' === origin) {
        return callback(null, true);
      }
      const time = moment().format('YYYY-MM-DD HH:mm:ss');
      const msg = `[${time}] ${origin} Not allowed by CORS\n`;
      fs.appendFile('./logs/error.log', msg, (err) => err);
      callback(msg);
    },
  }),
  morgan: morgan(':remote-addr [:date[clf]] :method :status :response-time[3] ms "[HTTP::http-version] :url"', {
    stream: accessLogStream,
  }),
  createServerOptions: {
    key: fs.readFileSync('./key/key.pem', 'utf8'),
    cert: fs.readFileSync('./key/cert.pem', 'utf8'),
  },
  errorHandler: (err, req, res, next) => {
    // 錯誤處理
    const msg = `[${moment().format()}] ${err.stack}`;
    errorLogStream.writeLine(msg);
    res.status(500).send('Server Error.');
    next();
  },
};
console.log(moment().format());
module.exports = config;
