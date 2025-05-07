const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const compression = require('compression');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const rfs = require('rotating-file-stream');

/*
 * custom modules  
*/
const indexRouter = require('./routes/index');
const fileUploadRouter = require('./routes/fileUpload');
const fileSender = require('./routes/fileSender')
const project = require('./routes/projects')
const category = require('./routes/category')
const passport = require('./config/passport');

// create an express application
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// logging
const logDirectory = path.join('/sjs', 'logs', 'morgan');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// logging format
const customLog =':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"  ":req[header]"  ":res[header]"  ":response-time[digits]" ';

// middlewares
app.use(logger(customLog, { stream: accessLogStream }))
app.use(compression());
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// disable x-powered by
app.disable('x-powered-by')

// express session
/*
 * change this in future; 
 * this uses memory storage, will lead to memory leak
 * read : https://github.com/expressjs/session 
*/
app.use(session({
  secret: "i @m the secret",
  name: 'sessionId',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

//  user authentication
app.use(passport.initialize())
app.use(passport.session())

// associate route handlers to  routing paths 
app.use('/', indexRouter);
app.use('/file', fileUploadRouter);
app.use('/projects', project);
app.use('/categories', category);
/*
 * pdf viewer will do xhr request to url :- /viewer/web/fileName 
 * fileSender will send the file if present
*/
app.use('/viewer/web/:uuid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})',
  (req, res, next) => {
    // add req uuid param to req as req.params cannot be accessed  by the fileSender.js
    req.fileUuid = req.params.uuid;
    next()
  }, fileSender);

// any file other than uuidv4
app.use('/viewer/web/:id', fileSender);


// undefined routes - throw 404
app.all('*', async (req,res,next)=>{
  res.render('404', { projectName: 'Not Found :(' })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // console.log("eror")
  console.log("error uncatached")
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  // console.log(err)
  res.render('404', { projectName: 'Not Found :(' })
});

process.on("uncaughtException", (req, res, err) => {
  // console.log(`uncaught error ${err}`);
  //return res.render('404', {projectName : 'Santhosh Not Found'})
})

module.exports = app;
