const express = require('express')
const router = express.Router()
const ticketSchema = require("../models/ticket-system")
const bodyParser = require("body-parser")
const {getDataById} = require("../modules/get-cache-by-id")

router.use(bodyParser.json())

router.post('/', async (req, res) => {
    const { guildId, channelId, ticket } = req.body
    try {
        const existingTicketSystem = await ticketSchema.findOne({ Guild: guildId })
        if (existingTicketSystem) {
            return res.status(409).send({ message: 'A ticket system already exists for this guild' })
        }
        const newTicketSystem = await ticketSchema.create({
            Guild: guildId,
            Channel: channelId,
            Ticket: ticket
        })
        if (newTicketSystem) {
            res.status(201).send({ message: "Ticket system created successfully" })
        } else {
            res.status(500).send({ message: "Internal Server Error" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})

router.put('/:guildid', async (req, res) => {
    const { ticket } = req.body
    const guildId = req.params.guildid
    try {
        const updateResult = await ticketSchema.updateOne({ Guild: guildId }, { Ticket: ticket })
        if (updateResult.nModified > 0) {
            res.status(200).send({ message: "Ticket system updated successfully" })
        } else {
            res.status(404).send({ message: "Ticket system not found" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})

router.get('/:guildid', async (req, res) => {
    getDataById(req, res, ticketSchema)
})

router.delete('/:guildid', async (req, res) =>{
    const guildId = req.params.guildid
    try {
        const deleteResult = await ticketSchema.deleteMany({ Guild: guildId })
        if (deleteResult.deletedCount > 0) {
            res.status(200).send({ message: 'Ticket system deleted successfully' })
        } else {
            res.status(404).send({ message: 'Ticket system not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})

module.exports = router
