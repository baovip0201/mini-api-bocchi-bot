const {model, Schema}=require("mongoose")

let ticketSchema= new Schema({
    Guild: String, 
    Channel: String,
    Ticket: String
},{versionKey: false})

module.exports = model("ticketSchema", ticketSchema)