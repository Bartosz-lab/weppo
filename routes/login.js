const express = require('express');
const session = require('express-session');
const router = express.Router();

const auth = require('../bin/auth');


//przekierowanie po zalogowaniu
router.get('/restricted', auth.restrict, function (req, res) {
    res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

//wylogowywanie
router.get('/logout', function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function () {
        res.redirect('/');
    });
});


  
//strona logowania
router.get('/', function(req, res){
    res.redirect('/login');
  });
router.get('/login', function (req, res) {
    res.render('test/login');
});

router.post('/login', (req, res) => {
    auth.authenticate(req.body.username, req.body.password, (err, user) => {
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate( _ => {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('back');
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.'
                + ' (use "tj" and "foobar")';
            res.redirect('/login');
        }
    });
});

router.get('/register', function (req, res) {
    res.render('test/register');
});
router.post('/register', (req, res) => {
    auth.register({phone: '123'}, req.body.username, req.body.password, err => {
        if (err) {
            req.session.error = err;
            res.redirect('/register');
        } else {
            req.session.success = 'You may now log in';
            res.redirect('/login');
        }
    });
});


//test user tj pass foobar
auth.register({phone: '123'} , 'tj', 'foobar', err => {})


module.exports = router;