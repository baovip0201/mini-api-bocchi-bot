const express = require('express')
const router = express.Router()
const ticketSchema = require("../models/ticket-system")
const bodyParser = require("body-parser")

module.exports = router

router.use(bodyParser.json())

router.post('/', async (req, res) => {
    const { guildId, channelId, ticket } = req.body
    try {
        ticketSchema.create({
            Guild: guildId,
            Channel: channelId,
            Ticket: ticket
        })
            .then((result) => {
                if (result) res.status(200).send({ message: "Lưu thành công" })
            })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

router.post('/:guildid', async (req, res) => {
    const { ticket } = req.body
    const guildId = req.params.guildid
    try {
        ticketSchema.findOne({ Guild: guildId })
            .then((data) => {
                if (data) {
                    const update = { Ticket: ticket }
                    ticketSchema.updateOne({ Guild: guildId }, update, { new: true })
                        .then((result) => {
                            if (result) {
                                return res.status(200).send({ message: "Update thành công" })
                            }else return res.status(404).send({ message:"Lỗi xảy ra"})
                        })
                }else return res.status(404).send({ message: "Not found"})
            })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

router.get('/:guildid', async (req, res) => {
    const guildId = req.params.guildid
    try {
        ticketSchema.findOne({ Guild: guildId })
            .then((data) => {
                if (data)
                    return res.status(200).send(data)
                    else return res.status(404).send({message: "Not Found"})
            })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})