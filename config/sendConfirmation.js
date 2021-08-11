const axios = require("axios")

// Enviar notificação de recebimento de pagamento de um serviço externo
module.exports = async (req, res) => {
  try {
      const response = await axios.get("http://o4d9z.mocklab.io/notify"); 
      console.log(response.data)
      return response.data
    } catch (err) {
      console.error(err);
    }
  }
  