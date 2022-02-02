const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const session       = require('express-session');
const multer        = require('multer');
var upload = multer();

const database = require('./database/database');
const typedef = require('./typedef');
const Role = typedef.role;

const indexRouter   = require('./routes/index');
const loginRouter   = require('./routes/login');
const accRouter     = require('./routes/account');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const orderRouter   = require('./routes/order');
const userRouter    = require('./routes/user');
const basketRouter    = require('./routes/basket');



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

app.use(async (req, res, next) => {
  const err = req.session.error;
  delete req.session.error;
  res.locals.error = '';
  if (err) {
    res.locals.error = err;
  }

  //navbar
  res.locals.role = Role;

  const user_role = req.session.role;
  res.locals.user_role = user_role;

  const number_of_roles = req.session.number_of_roles;
  res.locals.number_of_roles = number_of_roles;

  res.locals.cats = await database.get_categories();
  res.locals.subcats = await database.get_subcategories();

  res.locals.orders = [
    { date: "12-01-2022", price: "200" },
    { date: "13-02-2077", price: "1337" }
];;
  
  
  
  next();
});


app.use('/', loginRouter);
app.use('/', indexRouter);
app.use('/account', accRouter);
app.use('/p', productRouter);
app.use('/c', categoryRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);
app.use('/basket', basketRouter);

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
