const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  cpfOrcnpj: { type: String, required: true, unique: true},
  type: { type: String, required: true, enum: ["PF", "PJ"]},
  account: {
    agency: { type: String, required: true, default: "001" },
    accountNumber: { type: Number, required: true, unique: true },
    balance: { type: Number, required: true, default: 0, min: 0 },
  },
  transactionId: [{ type: Schema.Types.ObjectId, ref: "Transaction" }]
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
