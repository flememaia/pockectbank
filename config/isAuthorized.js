const axios = require("axios")

  module.exports = async (req, res) => {
    try {
        const response = await axios.get("https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6"); 
        console.log(response.data)
        return response.data
      } catch (err) {
        console.error(err);
      }
    }
