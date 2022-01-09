const express = require('express');
const router = express.Router();
module.exports = router;
const auth = require('../bin/auth');


router.get('/', auth.restrict_login, (req, res) => {
    res.send('Podstawowe informacje o koncie takie jak imię nazwisko email itp');
});

router.get('/settings', auth.restrict_login, (req, res) => {
    res.send('Edycja konta');
});