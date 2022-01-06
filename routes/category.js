const express = require('express');
const router = express.Router();
module.exports = router;


router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/:id',  (req, res) => {
    //strona kategorii
    res.send('kategoria o id:' + req.params.id);
});