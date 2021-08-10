const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema(
  {
    type: { type: String, required: true, enum: ["Efetuar Pagamento", "Receber Pagamento"]},
    value: { type: Number, required: true },
    payer: { type: String, required: true }, // any entity that issues a payment to another entity. 
    payee: { type: String, required: true }, // payee is the one that gets the money
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true } // tells Mongoose to automatically manage createdAt and updatedAt properties on your documents.
);

const TransactionModel = model("Transaction", TransactionSchema);

module.exports = TransactionModel;