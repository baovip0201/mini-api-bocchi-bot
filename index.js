const express = require('express');
const {connectDb}=require('./config/database')
const app = express();
const conversationLogRouter=require("./routes/conversation-log")
const ticketRouter=require("./routes/ticket-system")
const welcomeRouter=require("./routes/welcome")
require('dotenv').config()

connectDb()

app.use('/conversationlog', conversationLogRouter)
app.use('/ticketsystem', ticketRouter)
app.use('/welcome', welcomeRouter)

// Khởi động server
app.listen(3000, () => {
  console.log('Server started on port 3000')
});