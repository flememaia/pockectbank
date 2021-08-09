const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  cpfOrcnpj: { type: String, required: true, unique: true},
  transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" }
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
