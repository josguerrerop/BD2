const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const pgs = require('connect-pg-simple')(session);
const passport =require('passport');


//inicio
const app = express();
require('./lib/passport');


// Settings
app.set('port', process.env.PORT|| 4000);
app.set('views',path.join(__dirname,'views'));

app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine','.hbs');

  
//midleware
app.use(session({
    store: new pgs({
        conString: "postgres://postgres:x@localhost:5432/prontomueble"}),
    secret: 'x',
    resave: false,
    saveUninitialized: true
  }));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
// Global variables

app.use((req,res,next)=>{
app.locals.c = req.flash('c');
next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));
// Public
app.use(express.static(path.join(__dirname,'public')));

// Starting server
app.listen(app.get('port'), ()=> {
console.log('Server on port' , app.get('port'));
});