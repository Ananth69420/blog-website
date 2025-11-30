require('dotenv').config();
const express = require("express");
const connectDB = require('./configs/db/db');

const app = express();
const PORT = process.env.PORT || 5000

connectDB()

app.listen(PORT , () => {
    console.log(`Server is up and running in http://localhost:${PORT}`);
})