const mongoose = require('mongoose')

module.exports = {
    connectDb: async () => {
        const uri=process.env.MONGODB
        await mongoose.connect(
            uri,
            { useNewUrlParser: true, keepAlive: true });
        if (mongoose.connect) console.log("Đã kết nối tới MongoDB")

    }
}