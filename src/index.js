const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const pgs = require('connect-pg-simple')(session);
const passport = require('passport');



//inicio
const app = express();
require('./lib/passport');


// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

var hbs = require('handlebars');

hbs.registerHelper('showHr', function(index, options) {
    if (index < 3) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

hbs.registerHelper('admin', function(index, options) {
    if (index < 10) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});


//midleware
app.use(session({
    store: new pgs({
        conString: "postgres://postgres:x@localhost:8080/prontomueble"
    }),
    secret: 'x',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
// Global variables

app.use((req, res, next) => {
    app.locals.c = req.flash('c');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use(require('./routes/linksAdmin'));
app.use('/links', require('./routes/links'));
// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});