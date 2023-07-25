const { model, Schema, version } = require("mongoose")

let conversationLog = new Schema({
    Guild: {
        guildId: { type: String },
        guildName: { type: String}
    },
    Category: {
        categoryId: { type: String},
        categoryName: { type: String}
    },
    Channel: {
        channelId: { type: String},
        channelName: { type: String},
        content: [{
            userId: { type: String},
            userTag: { type: String},
            message: { type: String},
            timestamp: { type: String },
        }]
    }
}, {versionKey: false})

module.exports = model("log", conversationLog)