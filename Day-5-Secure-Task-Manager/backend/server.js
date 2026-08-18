const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");


dotenv.config();


connectDB();


const app = express();


// Middleware

app.use(cors());

app.use(express.json());



// Routes

app.use("/api/auth", require("./routes/authRoutes")); 
app.use(
    "/api/activities",
    require("./routes/activityRoutes")
);

app.use("/api/tasks", require("./routes/taskRoutes"));
const activityRoutes = require("./routes/activityRoutes");


app.use(
    "/api/activity",
    activityRoutes
);


// Error Middleware

app.use(errorHandler);



// Server

const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{

    console.log(`Server running on port ${PORT}`);

});