const {model, Schema}=require("mongoose")

let conversationLog=new Schema({
    GuildId: String,
    UserId: String,
    UserTag: String,
    Content: String,
})

module.exports=model("log", conversationLog)