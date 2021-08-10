const router = require("express").Router();

const UserModel = require("../models/User.model");
// const TransactionModel = require("../models/Transaction.model")

// cRud (READ) - HTTP GET
// Buscar dados do usuário
router.post("/newtransaction/:userId", async (req, res) => {
  
  //isolar o parâmetro de rota
  const { userId } = req.params

  try {

    const user = await UserModel.findOne({_id: userId});

    return res.status(200).json(user);

    // if (req.body.type === "Efetuar Pagamento" && user.type === "PJ") {
    //   // User PJ does not have permission to "Efetuar Pagamento"
    //   return res.status(401).json({ msg: "You do not have permission to this type of transaction." });
    // }

    // if (req.body.type === "Efetuar Pagamento" && user.type === "PF" && user.account.balance < req.body.value){
    //   return res.status(401).json({ msg: "Saldo Insuficiente." });
    // }

    // else if (req.body.type === "Receber Pagamento" || (req.body.type === "Efetuar Pagamento" && user.type === "PF" && user.account.balance >= req.body.value)){
    //   const newTransaction = await TransactionModel.create ({
    //     ...req.body
    //   })

    //    // Atualiza o saldo na conta do usuário
    //    const updatedBalanceAccount = await UserModel.findOneAndUpdate(
    //     {_id: userId},
    //     { // $inc: operador de incremento do MongoDB. Para decrementar, incremente um valor negativo
    //       $inc: { balance: amount }}
    //   );

      // // Adicionar a transação recém-criada no perfil do usuário
      // const updatedUser = await UserModel.findOneAndUpdate(
      //   { _id: loggedInUser._id },
      //   { $push: { transactions: newTransaction._id } }
      // );
      // Responder o cliente com os dados da transação. O status 200 significa OK
      // return res.status(200).json(newTransaction);
    // } else {
    //   // User PJ does not have permission to "Efetuar Pagamento"
    //   return res.status(401).json({ msg: "You do not have permission to this type of transaction." });
    // }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
