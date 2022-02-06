const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const database = require('./database/database');
const typedef = require('./typedef');
const Role = typedef.role;

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const accRouter = require('./routes/account');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const orderRouter = require('./routes/order');
const userRouter = require('./routes/user');
const basketRouter = require('./routes/basket');
const imageRouter = require('./routes/image');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret',
  cookie: { maxAge: 1000 * 60 * 15 } //15 min
}));

app.use(async (req, res, next) => {
  try {
    const err = req.session.error;
    delete req.session.error;
    res.locals.error = '';
    if (err) {
      res.locals.error = err;
    }

    //navbar
    res.locals.role = Role;
    res.locals.url = req.url;

    const user_role = req.session.role;
    res.locals.user_role = user_role;

    const number_of_roles = req.session.number_of_roles;
    res.locals.number_of_roles = number_of_roles;

    res.locals.cats = await database.get_categories();
    res.locals.subcats = await database.get_subcategories();

    if (user_role === Role.Customer) {
      res.locals.orders = await database.get_user_orders_info(req.session.user);
    }
    next();
  } catch (err) {
    res.send(err.message);
  }
});

app.use('/', loginRouter);
app.use('/', indexRouter);
app.use('/account', accRouter);
app.use('/p', productRouter);
app.use('/c', categoryRouter);
app.use('/order', orderRouter);
app.use('/users', userRouter);
app.use('/basket', basketRouter);
app.use('/image', imageRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
  res.locals.error = err.message
  res.status(err.status || 500);
  res.render('./error');
});
module.exports = app;