const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../database/database');


router.get('/', async (req, res) => {
  try {
    let products = [];
    if (req.session.user) {
      products = await database.get_products_to_basket(req.session.user);
    } else if (req.cookies.basket) {
      for (info of req.cookies.basket) {
        let product = await database.get_product_to_basket(info.id);
        product.quantity = info.quantity;
        products.push(product);
      }
    }
    const render_obj = {
      products: products
    }
    res.render('basket', render_obj);
  } catch (err) {
    req.session.error = err.message;
    res.redirect('/error');
  }
})
router.post('/add', async (req, res) => {
  try {
    if (req.session.user) {
      await database.update_product_in_basket(req.session.user, req.body.id, req.body.quantity);
    } else {
      let products = [];
      let found = false;
      if (req.cookies.basket) {
        for (info of req.cookies.basket) {
          if (info.id === req.body.id) {
            found = true;
            info.quantity = +info.quantity + +req.body.quantity;
          }
          products.push(info);
        }
      }
      if (!found) {
        products.push({ id: req.body.id, quantity: req.body.quantity });
      }
      res.cookie('basket', products);
    }
    res.send({Response:'0. Success'});
  } catch (err) {
    req.session.error = err.message;
    res.redirect('/error');
  }
})
router.post('/update', async (req, res) => {
  try {
    if (req.session.user) {
      await database.update_product_in_basket(req.session.user, req.body.id, req.body.quantity);
    } else {
      let products = [];
      if (req.cookies.basket) {
        for (info of req.cookies.basket) {
          if (info.id === req.body.id) {
            info.quantity = +req.body.quantity;
          }
          if( info.quantity != 0) {
            products.push(info);
          }
        }
      }
      res.cookie('basket', products);
    }
    res.send({Response:'0. Success'});
  } catch (err) {
    req.session.error = err.message;
    res.redirect('/error');
  }
})

