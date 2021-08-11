const router = require("express").Router();
const axios = require("axios")

const UserModel = require("../models/User.model");
const TransactionModel = require("../models/Transaction.model");

async function getAuthorization() {
  try {
    const response = await axios.get("https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6"); 
    console.log(response.data)
    return response.data
  } catch (err) {
    console.error(err);
  }
}

async function sendConfirmation() {
  try {
    const response = await axios.get("http://o4d9z.mocklab.io/notify"); 
    console.log(response.data)
    return response.data
  } catch (err) {
    console.error(err);
  }
}


router.post("/newtransaction", async (req, res) => {

  try {

    // req.body sempre vem de quem inicia a transação "Efetuar Pagamento". 
    // Logo, type sempre será "Efetuar Pagamento".

    const { type, payer, payee } = req.body

    let { value } = req.body

    // console.log(payer, value, payee)

    //###### PENDENTE
    //COMO USAR OPERADOR $or PRA PROCURAR O FULLNAME OU O CPF/CNPJ

    // Localizar o usuário pagador e salvar suas informações na variável user
    const user = await UserModel.findOne({ fullName: payer});
    console.log(user.accountBalance)

    // Confere se quem está iniciando a transação é PJ, se sim, já encerra com msg transação não permitida.
    if (user.type === "PJ"){
      console.log("Esta transação não é permitida")
      return res.status(401).json({ msg: "Esta transação não é permitida" });
    }

    // Confere se o saldo é suficiente para a transação.
    if (user.accountBalance < value){
      console.log("The Balance is enough")
      return res.status(401).json({ msg: "Saldo Indisponível" });
    }

    // return res.status(200).json(user);

    // Se passou por todos os ifs, prosseguir com a solicitação de Autorização externa
    const isAuthorized = await getAuthorization() 
    // console.log(isAuthorized.message)
    if( isAuthorized.message === "Autorizado"){
      // console.log(user._id)
      const newTransaction = await TransactionModel.create({...req.body, userId: user._id})
      // console.log(newTransaction)
      // return res.status(200).json(newTransaction);

    // localizar e atualizar o balance do payee
    const userPayee = await UserModel.findOne({ fullName: payee});
    // console.log(userPayee, userPayee._id)
    // return res.status(200).json(userPayee);

    const updatedUserPayeeAccount = await UserModel.findOneAndUpdate(
      { _id: userPayee._id },
      {
        // $inc: operador de incremento do MongoDB. Para decrementar, incremente um valor negativo
        $inc: {
          accountBalance: value,
        }, $push: { transactionId: newTransaction._id }
      },
      { new: true }
    );

    // console.log(updatedUserPayeeAccount)
    // return res.status(200).json(updatedUserPayeeAccount);

    // atualizar o balance do payer para negativo
    value = (- value)
    // console.log(value)

    const updatedUserAccount = await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        // $inc: operador de incremento do MongoDB. Para decrementar, incremente um valor negativo
        $inc: {
          accountBalance: value,
        }, $push: { transactionId: newTransaction._id }
      },
      { new: true }
    );

    // console.log(updatedUserAccount)
    // return res.status(200).json(updatedUserAccount);

    const confirmation = sendConfirmation() 
    // console.log(confirmation.message)

    // Tudo dando certo, retornar a transação realizada, sem a necessidade de agaurdar a msg de confirmação ao destinatário. 
    return res.status(200).json(newTransaction);
    
  }
  return res.status(401).json({ msg: "Transação não autorizada" });
  
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
