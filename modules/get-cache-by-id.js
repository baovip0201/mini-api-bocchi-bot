const redis = require("redis")
const client = redis.createClient()
const getDataById= async( req, res, Model)=>{
    const guildId = req.params.guildid
    const key = `guildid:${guildId}`
    try {
        //await client.connect()
        // client.get(key, (err, result) => {
        //     if (err) {
        //         console.error(error)
        //         res.status(500).send("Internal Server Error")
        //     }
        //     else if (result) {
        //         const data = JSON.parse(result)
        //         res.status(200).send(data)
        //     } else {
                Model.findOne({ Guild: guildId })
                    .then((data) => {
                        if (data)
                            return res.status(200).send(data)
                        else return res.status(404).send({ message: "Not Found" })
                    })
        //     }
        // })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

module.exports={getDataById}