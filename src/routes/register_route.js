'use strict'

const express = require('express');
const router = express.Router();
const { renderRegister, postRegister } = require('../controllers/register_controller');

router.get('/', renderRegister);
router.post('/', postRegister);

module.exports = router;