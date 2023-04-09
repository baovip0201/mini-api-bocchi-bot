const express = require('express')
const router = express.Router()
const conversationSchema = require("../models/conversation-log")
const bodyParser = require("body-parser")

module.exports = router

router.use(bodyParser.json())

router.post('/', async(req, res)=>{
    const {guildId, userId, userTag, content}=req.body
    try {
        conversationSchema.create({
            GuildId: guildId,
            UserId: userId,
            UserTag: userTag,
            Content: content
        })
        .then((result)=>{
            if(result) res.status(200).send({message: "Lưu thành công"})
        })
    } catch (error) {
        console.error(error)
        res.status(500).send()
    }
})