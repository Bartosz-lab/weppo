const express = require('express');
const router = express.Router();
module.exports = router;


router.get('/:id', async (req, res) => {
  try {
    res.sendFile(`./images/${req.params.id}`)
  } catch (err) {
    req.session.error = err.message;
    res.redirect('/error');
  }
});
