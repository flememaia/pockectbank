const axios = require("axios")

  module.exports = async (req, res) => {
    try {
        const response = await axios.get("http://o4d9z.mocklab.io/notify"); 
        console.log(response.data)
        return response.data
      } catch (err) {
        console.error(err);
      }
    }