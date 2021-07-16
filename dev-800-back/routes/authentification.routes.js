var express = require('express');
var router = express.Router();
var AuthnetificationController =require('../controllers/authentificationController')
router.post('/login',AuthnetificationController.LoginUser);
router.post('/inscription',AuthnetificationController.InscriptionUser);
router.get('/confirmation/:confirmationCode',AuthnetificationController.ConfirmationMail);
router.post('/demandemotdepasse',AuthnetificationController.demandeMotDePasseOublie);
router.post('/changementPassword/:resetToken/:id',AuthnetificationController.recoverMotPasse);


module.exports = router; 