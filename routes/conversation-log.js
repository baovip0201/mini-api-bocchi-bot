const express = require('express')
const router = express.Router()
const conversationSchema = require("../models/conversation-log")
const bodyParser = require("body-parser")
const throttle = require("../middleware/throttling")
const throttling = require('../middleware/throttling')

module.exports = router

router.use(bodyParser.json())

router.post('/', throttle, async (req, res) => {
    const { guildId, guildName, categoryId, categoryName, channelId, channelName, userId, userTag, messages } = req.body
    const now=new Date()
    const timetamp=`${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
    const content = { userId, userTag, messages, timetamp }
    try {
        conversationSchema.findOne(
            { 'Guild.guildId': guildId, 'Category.categoryId': categoryId, 'Channel.channelId': channelId },
        ).then(async (data) => {
            if (!data) {
                conversationSchema.create({
                    Guild: {
                        guildId: guildId,
                        guildName: guildName
                    },
                    Category: {
                        categoryId: categoryId,
                        categoryName: categoryName
                    },
                    Channel: {
                        channelId: channelId,
                        channelName: channelName,
                        content: [content]
                    }
                }).then((result) => {
                    if (result) return res.status(200).send({ message: "Thêm vào thành công" })
                    else return res.status(404).send({ message: "Thất bại" })
                })
            } else if(data){
                await conversationSchema.updateOne(
                    { 'Guild.guildId': guildId, 'Category.categoryId': categoryId,'Channel.channelId': channelId},
                    { $push: { 'Channel.content': content } },
                    { new: true })
                    .then((result) => {
                        if (result) return res.status(200).send({ message: "Update thành công" })
                        else return res.status(404).send({ message: "Có lỗi xảy ra" })
                    })
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

router.get('/getall', throttling, async (req, res)=>{
    try {
        await conversationSchema.find().then((data)=>{
            if(data){
                res.status(200).send(data)
            }else{
                res.status(500).send("Internal Server Error")
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})