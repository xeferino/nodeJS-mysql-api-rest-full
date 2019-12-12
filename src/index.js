const express        =        require('express');
const morgan         =        require('morgan');
const exphbs         =        require('express-handlebars');
const path           =        require('path');
const flash          =        require('connect-flash');
const session        =        require('express-session');
const MySQLStorage   =        require('express-mysql-session');
const { database }   =        require('./keys'); 
const passport       =        require('passport');

//initialiazations
const app = express();
require('./lib/passport')

//settings
app.set('nameApp', 'Sipol');
//app.set('port', process.env.PORT || 4000);
app.set('port', 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars'),
}));
app.set('view engine', '.hbs');

//middlewares
app.use(session({
    secret: 'apinodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStorage(database)

}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes/'));
app.use('/api-weapons', require('./routes/weapons'));
app.use('/api-weapons', require('./routes/authentication'));

//files public
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
app.listen(app.set('port'), () => {
    console.log('Example app listening on port port!');
});
//Run app, then load http://localhost:port in a browser to see the output.