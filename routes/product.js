const express = require('express');
const router = express.Router();
module.exports = router;


router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/:id',  (req, res) => {
    //strona produktu
    res.send('produkt o id:' + req.params.id);
});