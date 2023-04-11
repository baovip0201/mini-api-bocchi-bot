const express = require('express')
const router = express.Router()
const welcomeSchema = require("../models/welcome")
const bodyParser = require("body-parser")
const {getDataById} = require("../modules/get-cache-by-id")
const throttle = require("../middleware/throttling")

module.exports = router

router.use(bodyParser.json())

router.post('/', throttle, async (req, res) => {
    const { guildId, channelId, content, role } = req.body
    if (!guildId || !channelId || !content || !role) {
        return res.status(400).send({ message: "Bad Request" })
    }

    try {
        const data = await welcomeSchema.findOne({ Guild: guildId })
        if (data) {
            return res.status(409).send({ message: 'Đã tồn tại' })
        }

        const result = await welcomeSchema.create({
            Guild: guildId,
            Channel: channelId,
            Content: content,
            Role: role
        })
        if (result) {
            return res.status(201).send({ message: "Lưu thành công" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})

router.get('/:guildid', throttle, async (req, res) => {
    getDataById(req, res, welcomeSchema)
})
