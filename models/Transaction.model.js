const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema(
  {
    value: { type: Number, required: true },
    payer: { type: Number, required: true }, // any entity that issues a payment to another entity. 
    payee: { type: Number, required: true }, // payee is the one that gets the money
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // tells Mongoose to automatically manage createdAt and updatedAt properties on your documents.
);

const TransactionModel = model("Transaction", TransactionSchema);

module.exports = TransactionModel;