const express = require('express')
const router = express.Router()
const conversationSchema = require("../models/conversation-log")
const bodyParser = require("body-parser")
const throttle = require("../middleware/throttling")

router.use(bodyParser.json())

router.post('/', async (req, res) => {
    const { guildId, guildName, categoryId, categoryName, channelId, channelName, userId, userTag, messages } = req.body
    const now = new Date()
    const utcOffset = 7;
    now.setUTCHours(now.getUTCHours() + utcOffset);
    const timestamp = `${now.getUTCHours()}:${now.getUTCMinutes()} ${now.getUTCDate()}/${now.getUTCMonth() + 1}/${now.getUTCFullYear()}`;
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
                { $push: { 'Channel.content': {$each: [content], $position: 0} } }
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
        const data = await conversationSchema.find().sort({createdAt: -1})
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
