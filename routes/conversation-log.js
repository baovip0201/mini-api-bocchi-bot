const express = require('express')
const router = express.Router()
const conversationSchema = require("../models/conversation-log")
const bodyParser = require("body-parser")
const throttle = require("../middleware/throttling")

router.use(bodyParser.json())

router.post('/', async (req, res) => {
    const { guildId, guildName, categoryId, categoryName, channelId, channelName, userId, userTag, messages } = req.body
    const now = new Date()
    const timestamp = `${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
    const content = {
        userId: userId,
        userTag: userTag,
        message: messages,
        timestamp: timestamp
    }

    try {
        const data = await conversationSchema.findOne({ 'Guild.guildId': guildId, 'Category.categoryId': categoryId, 'Channel.channelId': channelId })
        if (!data) {
            const newConversation = new conversationSchema({
                Guild: { guildId, guildName },
                Category: { categoryId, categoryName },
                Channel: { channelId, channelName, content: [content] }
            })
            await newConversation.save()
            return res.status(201).send({ message: "Thêm vào thành công" })
        } else {
            await conversationSchema.updateOne(
                { 'Guild.guildId': guildId, 'Category.categoryId': categoryId, 'Channel.channelId': channelId },
                { $push: { 'Channel.content': content } }
            )
            return res.status(200).send({ message: "Update thành công" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})

router.get('/getall', throttle, async (req, res) => {
    try {
        const data = await conversationSchema.find()
        if (data) {
            res.status(200).send(data)
        } else {
            res.status(404).send({ message: "Không tìm thấy dữ liệu" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})

module.exports = router
