const getDataById = async (req, res, Model) => {
    const guildId = req.params.guildid;
    try {
      const data = await Model.findOne({ Guild: guildId });
      if (data) {
        return res.status(200).send(data);
      } else {
        return res.status(404).send({ message: "Not Found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };
  
  module.exports = { getDataById };
  