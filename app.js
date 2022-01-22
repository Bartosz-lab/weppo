const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const session       = require('express-session');
const multer        = require('multer');
var upload = multer();

const typedef = require('./typedef');
const role = typedef.role;

const indexRouter   = require('./routes/index');
const loginRouter   = require('./routes/login');
const accRouter     = require('./routes/account');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const orderRouter   = require('./routes/order');
const adressRouter  = require('./routes/adress');
const userRouter    = require('./routes/user');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret',
  cookie: {maxAge: 1000 * 60 * 15} //15 min
}));



//testowo 
app.use(function (req, res, next) {
  var err = req.session.error;
  var user_role = req.session.role;
  delete req.session.error;

  res.locals.error = '';
  res.locals.user_role = undefined;
  res.locals.role = role;
  
  if (err) res.locals.error = err;
  if (user_role != undefined) res.locals.user_role = user_role;
  next();
});


app.use('/', loginRouter);
app.use('/', indexRouter);
app.use('/account', accRouter);
app.use('/p', productRouter);
app.use('/c', categoryRouter);
app.use('/order', orderRouter);
app.use('/adress', adressRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
