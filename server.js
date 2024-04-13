const express = require("express"); // imports express
const cors = require("cors");
const path = require("path");
const app = express(); //creates app using express - we will use this a lot
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require ("dotenv").config();// using the package installed on step 13 to do this we need to add a constant for it .config allows us to get the value from the .env file

connectDb();


const port = process.env.PORT; // get the constant from the .env file
app.use(cors());

app.use(express.json());

// Routes
app.use("/api/students", require("./routes/studentRoute")); // middleware 
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Middleware
app.use(errorHandler);



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get ("/", (req, res)=> {
        res.render('index');
});


app.listen(port, ()=> { // listens 
        console.log(`Server running on port ${port}`);
});


