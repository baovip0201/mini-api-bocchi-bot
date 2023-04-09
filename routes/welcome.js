const express = require('express')
const router = express.Router()
const welcomeSchema = require("../models/welcome")
const bodyParser = require("body-parser")
const welcome = require('../models/welcome')

module.exports = router

router.use(bodyParser.json())

router.post('/', async (req, res) => {
    const { guildId, channelId, content, role } = req.body
    try {
        await welcomeSchema.findOne({ Guild: guildId }).then(async (data) => {
            if (!data) {
                await welcomeSchema.create({
                    Guild: guildId,
                    Channel: channelId,
                    Content: content,
                    Role: role
                }).then((result) => {
                    if (result) res.status(200).send({ message: "Lưu thành công" })
                })
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

router.get('/:guildid', async (req, res) => {
    const guildId = req.params.guildid
    try {
        welcomeSchema.findOne({ Guild: guildId })
            .then((data) => {
                if (data)
                    return res.status(200).send(data)
                else return res.status(404).send({ message: "Not Found" })
            })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})