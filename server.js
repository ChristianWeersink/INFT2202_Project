const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const passport = require('./middleware/authenticate'); // Import Passport configuration
const { User } = require('./models/userModel');
const dotenv = require('dotenv').config();

connectDb();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/students', require('./routes/studentRoute'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Middleware
app.use(errorHandler);

// Home page route
app.get('/', (req, res) => {
    res.render('index');
});

// Sign in route
app.get('/sign-in', (req, res) => {
    res.render('sign-in');
});

app.post("/sign-in", passport.authenticate('local'), (req, res) => {
        // If passport.authenticate('local') succeeds, this function will be called
        // This means the user has been authenticated successfully
        console.log("sign in success, sending response");
        const authenticatedUser = req.user;
        console.log("authenticated user: " + authenticatedUser)
        // You can customize the response data based on your requirements
        res.status(200).json({ success: true, user: authenticatedUser }); 
    });

// Dashboard route
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// Serve JavaScript files
app.use('/scripts', (req, res, next) => {
    res.type('application/javascript');
    next();
}, express.static(path.join(__dirname, 'views/scripts')));

app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});

// Corrected 'res.render()' statement for logout route
app.get('/logout', (req, res) => {
    res.render('logout');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
