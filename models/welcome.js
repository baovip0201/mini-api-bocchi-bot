const {model, Schema}=require("mongoose")
 
let welcomeSchema=new Schema({
    Guild: String,
    Channel: String,
    Content: String,
    Role: String
},{versionKey: false})

module.exports = model("welcome", welcomeSchema)