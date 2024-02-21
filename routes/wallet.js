
const express = require('express');
const router = express.Router();
const { pay, response, balance } = require('../controllers/wallet');

router.get('/pay', pay);
router.get('/response', response);
router.get('/:userId/balance', balance);

module.exports = router;


