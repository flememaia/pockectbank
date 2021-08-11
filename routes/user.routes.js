const router = require("express").Router();

const UserModel = require("../models/User.model");

// Criar um novo usuário, com id sequencial
router.post("/signup", async (req, res) => {

  try {

    const lastInsertedUser = await UserModel.findOne(
      {},
      { id: 1 },
      { sort: { id: -1 }, limit: 1 }
    );

    // id sequencial. Adicionar um ao ultimo numero de id criado. Caso ainda não exista usuários, 
    // fixamos o valor em 1
    const newId = lastInsertedUser
      ? lastInsertedUser.id + 1
      : 1;

    // Salva os dados de usuário no banco de dados (MongoDB) usando o body da requisição como parâmetro
    // e o id sequencial = newId
    const newUser = await UserModel.create({
      ...req.body,
      id: newId
    });

    // Responder o usuário recém-criado no banco para o cliente (solicitante). 
    // O status 201 significa Created
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    // O status 500 signifca Internal Server Error
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
