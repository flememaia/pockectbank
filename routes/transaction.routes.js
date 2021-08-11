const router = require("express").Router();

const UserModel = require("../models/User.model");
const TransactionModel = require("../models/Transaction.model");
const getAuthorization = require ("../config/isAuthorized")
const sendConfirmation = require("../config/sendConfirmation")

router.post("/newtransaction", async (req, res) => {

  try {

    // req.body sempre vem de quem inicia a transação, logo, sempre será "Efetuar Pagamento". 
    const { payer, payee } = req.body

    let { value } = req.body

    // Localizar o usuário ques está fazendo a transferência (payer) e salvar suas informações na variável user
    const user = await UserModel.findOne({ id: payer});
    console.log(user.accountBalance)
    console.log(user._id)

    //#################DELETAR
    // return res.status(200).json(user);

    // Confere se quem está iniciando a transação é PJ, se sim, já encerra com msg de que a transação não é permitida.
    if (user.type === "PJ"){
      console.log("Esta transação não é permitida")
      return res.status(401).json({ msg: "Esta transação não é permitida" });
    }

    // Passou pelo filtro PF, confere se o saldo é suficiente para a transação.
    if (user.accountBalance < value){
      console.log("Saldo Indisponível")
      return res.status(401).json({ msg: "Saldo Indisponível" });
    }

    // Se o saldo for suficiente, prosseguir com a solicitação de Autorização externa
    const isAuthorized = await getAuthorization() 

    // Se autorizado, gerar a transação
    if( isAuthorized.message === "Autorizado"){
      const newTransaction = await TransactionModel.create({...req.body, userId: user._id})
    //#################DELETAR
      // return res.status(200).json(newTransaction);

    // Localizar e atualizar o balance do payee e incluir o id da transação no payee
    const userPayee = await UserModel.findOne({ id: payee});
    //#################DELETAR
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

    // return res.status(200).json(updatedUserPayeeAccount);

    // atualizar o balance do payer para negativo (incrementar valor negativo)
    value = (- value)

    // Atualizar o balance do payee e incluir o id da transação no payer (payer = user)
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

    // return res.status(200).json(updatedUserAccount);

    // Enviar notificação de recebimento de pagamento de um serviço externo. 
    const confirmation = sendConfirmation() 

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
