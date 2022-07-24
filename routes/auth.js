const express = require('express');
const bcrypt = require('bcrypt');
const jsonwebtoken  = require('jsonwebtoken');
const {ERROR, OK} = require('../logger/logger');
const User = require('../models/user');
const router = express.Router();

router.post('/signup', function(req, res) {
    if (!req.body.email ||
        !req.body.password) {
        console.log(ERROR(`POST - /api/auth/signup - 400 `) + ': Email ou mot de passe vide.');
        return res.status(400).json({message: 'Email ou mot de passe vide.'});
    }

    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    });

    user.save()
        .then(() => {
            console.log(OK(`POST - /api/auth/signup - 201 `) + ': Utilisateur crée.');
            res.status(201).json({ message: 'Utilisateur crée.'})
        })
        .catch((error) => {
            console.log(ERROR(`POST - /api/auth/signup - 500 `) + ": "+ error);
            res.status(500).json({ message: error})
        })
});

router.post('/login', function(req, res) {
    if (!req.body.email ||
        !req.body.password) {
        console.log(ERROR(`POST - /api/auth/login - 400 `) + ': Email ou mot de passe vide.');
        return res.status(400).json({ userId: '', token: '' }
        );
    }

    User.findOne({ email: req.body.email})
        .then((user) => {
            if  (!user) {
                console.log(ERROR(`POST - /api/auth/signup - 400 `) + ': Email incorrect.');
                res.status(400).json({ userId: '', token: '' })
            } else if (bcrypt.compareSync(req.body.password, user.password) === false) {
                console.log(ERROR(`POST - /api/auth/signup - 400 `) + ': Mot de passe incorrect.');
                res.status(400).json({ userId: '', token: '' })
            } else {
                console.log(OK(`POST - /api/auth/login - 200 `) + ': Utilisateur connecté.');
                res.status(200).json({ userId: user._id, token: jsonwebtoken.sign(
                        { userId: user._id },
                        'DoAY4daG4fXD3JsM?!Hh9JgiPc$TG7',
                        { expiresIn: '2h' }
                    )
                })
            }
        })
        .catch((error) => {
            console.log(ERROR(`POST - /api/auth/signup - 500 `) + ": "+ error);
            res.status(500).json({ userId: '', token: '' })
        })
});

module.exports = router;
