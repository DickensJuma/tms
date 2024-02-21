const path = require("path");
const axios = require("axios");
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Booking = require("../models/Booking");
const dotenv = require("dotenv");
dotenv.config();
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTERWAVE_V3_PUBLIC_KEY ,process.env.FLUTTERWAVE_V3_SECRET_KEY);


exports.pay = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pay.html"));
  };
  
 exports.response = async (req, res) => {
    const { transaction_id } = req.query;
     console.log(req.query)

    const response = await flw.Transaction.verify({id: transaction_id});

    console.log("response",response)
  
    const { status, currency, id, amount, customer } = response.data;

    if(response.status !== "success"){
        return res.status(409).send("Payment not succesful")
    }
  
    // check if transaction id already exist
  
    const transactionExist = await Transaction.findOne({ transactionId: id });

  
    if (transactionExist) {
      return res.status(409).send("Transaction Already Exist");
    }
    // check if customer exist in our database
    const user = await User.findOne({ phone: customer.phone_number.substring(3) });
  
    console.log("user",user)

    // Get the bus booking and update to payed

    const booking = await Booking.findOne({user: user._id, verification: 'notverified'})
    console.log("booking",booking)

    booking.verification ='payed'
    booking.save()

    // check if user have a wallet, else create wallet

    const wallet = await validateUserWallet(user._id);
  
    // create wallet transaction
    await createWalletTransaction(user._id, status, currency, amount);
  
    // create transaction
    await createTransaction(user._id, id, status, currency, amount, customer);
  
    await updateWallet(user._id, amount);
  
    return res.status(200).json({
      response: "wallet funded successfully",
      data: wallet,
    });
  };
  
 exports.balance = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const wallet = await Wallet.findOne({ userId });
      // user
      res.status(200).json(wallet.balance);
    } catch (err) {
      console.log(err);
    }
  }
  
  const validateUserWallet = async (userId) => {
    try {
      // check if user have a wallet, else create wallet
      const userWallet = await Wallet.findOne({ userId });
  
      if (!userWallet) {
        // create wallet
        const wallet = await Wallet.create({
          userId,
        });
        return wallet;
      }
      return userWallet;
    } catch (error) {
      console.log(error);
    }
  };
  
  const createWalletTransaction = async (userId, status, currency, amount) => {
    try {
      // create wallet transaction
      const walletTransaction = await WalletTransaction.create({
        amount,
        userId,
        isInflow: true,
        currency,
        status,
      });
      return walletTransaction;
    } catch (error) {
      console.log(error);
    }
  };
  
  const createTransaction = async (
    userId,
    id,
    status,
    currency,
    amount,
    customer
  ) => {
    try {
      // create transaction
      const transaction = await Transaction.create({
        userId,
        transactionId: id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone_number,
        amount,
        currency,
        paymentStatus: status,
        paymentGateway: "flutterwave",
      });
      return transaction;
    } catch (error) {
      console.log(error);
    }
  };
  
  const updateWallet = async (userId, amount) => {
    try {
      // update wallet
      const wallet = await Wallet.findOneAndUpdate(
        { userId },
        { $inc: { balance: amount } },
        { new: true }
      );
      return wallet;
    } catch (error) {
      console.log(error);
    }
  };