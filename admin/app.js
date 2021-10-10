require('dotenv').config({path: './env-files/production.env'});
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const initAuthMiddleware = require('./features/login/init-auth-middleware');
const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "./public")));

const { PORT } = process.env;
app.use(
  session({
    secret: 'keyboard cat',
    name: "admin mon",
    resave: false,
    saveUninitialized: true,
  })
);

initAuthMiddleware(app);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).render('pages/404');
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
