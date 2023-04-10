const express = require('express')
const router = express.Router()
const welcomeSchema = require("../models/welcome")
const bodyParser = require("body-parser")
const welcome = require('../models/welcome')
const {getDataById}=require("../modules/get-cache-by-id")
const throttle=require("../middleware/throttling")

module.exports = router

router.use(bodyParser.json())

router.post('/',throttle, async (req, res) => {
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
                    if (result) {
                        res.status(200).send({ message: "Lưu thành công" })
                        const key = `guildid:${result.GuildId}`;
                        const value = JSON.stringify(result.toObject());

                        client.set(key, value, (err, result) => {
                            if (err) {
                                console.error(err);
                            }
                        });
                    }
                })
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

router.get('/:guildid', throttle, async (req, res) => {
    getDataById(req, res, welcomeSchema)
})