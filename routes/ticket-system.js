const express = require('express')
const router = express.Router()
const ticketSchema = require("../models/ticket-system")
const bodyParser = require("body-parser")
const {getDataById}=require("../modules/get-cache-by-id")
const throttle=require("../middleware/throttling")

module.exports = router

router.use(bodyParser.json())

router.post('/',throttle, async (req, res) => {
    const { guildId, channelId, ticket } = req.body
    try {
        ticketSchema.findOne({ Guild: guildId}).then((data)=>{
            if(!data){
                ticketSchema.create({
                    Guild: guildId,
                    Channel: channelId,
                    Ticket: ticket
                }).then((result) => {
                    if (result) {
                        res.status(200).send({ message: "Lưu thành công hệ thống ticket" })
                        // const key = `guildid:${result.GuildId}`;
                        // const value = JSON.stringify(result.toObject());
        
                        // client.set(key, value, (err, result) => {
                        //     if (err) {
                        //         console.error(err);
                        //     }
                        // });
                    }
                })
            }else return res.status(401).send({message: 'Mỗi guildId chỉ tồn tại tối đa 1 hệ thống ticket'})
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

router.post('/:guildid', throttle, async (req, res) => {
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
                                res.status(200).send({ message: "Update thành công" })
                                // const key = `guildid:${result.GuildId}`;
                                // const value = JSON.stringify(result.toObject());

                                // client.set(key, value, (err, result) => {
                                //     if (err) {
                                //         console.error(err);
                                //     }
                                // });

                            } else return res.status(404).send({ message: "Lỗi xảy ra" })
                        })
                } else return res.status(404).send({ message: "Not found" })
            })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

router.get('/:guildid', throttle, async (req, res) => {
    getDataById(req, res, ticketSchema)
})

router.delete('/:guildid', throttle, async (req, res) =>{
    const guildId= req.params.guildid
    ticketSchema.deleteMany({Guild: guildId}).then((err, data)=>{
        res.status(200).send({message: 'Đã loại bỏ hệ thống ticket'})
    })
})