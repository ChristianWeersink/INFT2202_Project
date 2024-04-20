const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const passport = require('./middleware/authenticate'); // Import Passport configuration
const User = require('./models/userModel');
const Task = require('./models/tasksModel');
const dotenv = require('dotenv').config();
const {createTask, getAllTasks, deleteTaskById, updateTaskById} = require("./controllers/tasksController");
const {registerUser} = require("./controllers/userController");

connectDb();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/views', express.static('views'));
app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/public/images', express.static('images'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Routes
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
        
        // Set user information in cookies
        const authenticatedUser = req.user;
        res.cookie('user', JSON.stringify(authenticatedUser));
        res.cookie('success', true);
        res.cookie('loggedIn', true);
    
        // Respond with a success message or redirect to the dashboard
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

app.post('/sign-up', async (req, res) => {
        try {
            await registerUser(req, res);
            res.status(201).json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false, message: error.message });
        }
    });
    



// Corrected 'res.render()' statement for logout route
app.get('/logout', (req, res) => {
        res.render('logout');
});

// Tasks route

app.delete('/tasks/:id', async (req, res) => {
        try {
                await deleteTaskById(req, res);
        } catch (error) {
                res.status(500).json({message: error.message});
        }
})

app.put('/tasks/:id', async (req, res) => {
        try {
                await updateTaskById(req, res);
        } catch (error) {
                res.status(500).json({message: error.message});
        }
})

app.get('/tasks', async (req, res) => {
        try {
                // Retrieve all tasks from the database
                await getAllTasks(req, res);
        } catch (error) {
                // Handle errors
                res.status(500).json({ message: error.message });
        }
});

app.post('/tasks', async (req, res) => {
        try {
            // Call the createTask function to create a new task
            await createTask(req, res);
        } catch (error) {
            console.log("error creating task");
            // Handle errors
            res.status(500).json({ message: error.message });
        }
    });


// Footer routes

// About Us route
app.get('/aboutus', (req, res) => {
        res.render('aboutus');
});

// Cookie Policy route
app.get('/cookies', (req, res) => {
        res.render('cookies');
});

// Privacy Policy route
app.get('/privacy', (req, res) => {
        res.render('privacy');
});


app.listen(port, () => {
        console.log(`Server running on port ${port}`);
});
