const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

const PORT = process.env.PORT || 3000;
//passport config
require('./config/passport')(passport);
//connect to mongo
mongoose.connect('mongodb://localhost:27017/myContact_database', { useNewUrlParser: true })
    .then(() => console.log('MongoDb is connected...'))
    .catch(err => console.log(err));

//ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

//bodyparser => we can use req.body
app.use(express.urlencoded({ extended: false }));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
//flash-connect
app.use(flash());

//global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));





app.listen(PORT, console.log(`Server is running on port ${PORT}`));