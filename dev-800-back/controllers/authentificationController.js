'use strict';
const User = require('../models/user.model');
const Token = require('../models/Token.model');
const bcryptSalt = process.env.BCRYPT_SALT;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('basic-auth');
const config =require('../settings/applicationconfig.json')
const nodemailer = require('nodemailer');
const crypto = require("crypto");

var LoginUser = function(req, res, next) {
    const credentials = auth(req);
    // TODO : enable this comment
    if (!credentials) { //Si le champs envoyé sont vide on renvoie une erreur 400 
        res.status(400).send({ message:"Invalid Request !"});
    }
    User.findOne({ $or: [{ email: credentials.name }, { username: credentials.name }] }, function(err, user) { // on cherche dans la BDD si le user passé existe ou pas 

        if (err) return res.status(500).send({ message: "Error on the server." }); //Si il y a un bug on renvoie une erreur 500
        if (!user) return res.status(404).send({ message: "Email or usernmae incorrect" }); // si l'utilisateur n'existe pas on renvoie une réponse 404
        //if (user.status!='Confirme') return res.status(401).send({ message: "Email non confirmé, regardez vos mails" }); // Email non confirmé

        var passwordIsValid = bcrypt.compareSync(credentials.pass, user.password); //On vérifie si le mot de passe est good 
        if (!passwordIsValid) return res.status(401).send({ message:"Mot de passe incorrect"}); //Si le mot de passe est erroné on renvoie une reponse 401
        var token = jwt.sign({ username: user.username }, config.secret, { //Sinon si le mot de passe + login est correcte on authentifie le user dans le serveur
            //et on crée un token 
            expiresIn: 86400 // token expiré dans 24 heures 
        });
        res.status(200).send({ auth: true, token: token, user: user }); //on renvoie le token avec le user
    });
}
var InscriptionUser=function(req,res,next){
    const salt = bcrypt.genSaltSync(10);
    var messageEchoue="";
    console.log("MyName : ",req.body.username);
    if (!req.body.password)
        messageEchoue+="Champs mot de passe vide ";
        if (!req.body.username)
        messageEchoue+="--Champs username vide  ";
        if (!req.body.email)
        messageEchoue+="--Champs Email vide ";
        if (!req.body.nom)
        messageEchoue+="--Champs Nom vide ";
        if (!req.body.prenom)
        messageEchoue+="--Champs Prenom vide ";
    if(messageEchoue.length>5)
    res.status(500).json({message: messageEchoue});
   
try{
    const hash = bcrypt.hashSync(req.body.password, salt);
    const tokenConfirmatioMail= jwt.sign({email: req.body.email}, config.secret);
    const user = new User({

        username: req.body.username,
        email: req.body.email,
        nom: req.body.nom,
        prenom: req.body.prenom,
        password: hash,
        confirmationCode : tokenConfirmatioMail

     });
     
     console.log("Here")
    
     user.save().then(function(u){
         
        const html ='<p> Bonjour,veuillez confirmer votre inscription en cliquant sur : <a href="'+config.confirmUrl+"/"+u.confirmationCode+'">ce lien </a></p>'
        if(EnvoieMail(req.body.email,"Confirmation inscription à PictManager","Confirmation mail",html))
        {
            res.status(201).json({message:"Utilisateur a été crée avec succées",user:u})

        }
        else{
            res.status(400).json({message:"Error envoie mail",user:u})

        }

     })
     .catch(err => {
        console.log("Error saving User ...");

        console.log(err)
        if (err.code == 11000) {
            res.status(409).json({ message: "Utilisateur existe déjà" });

        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

}
catch(e){
    console.log(e)
    res.status(500).json({ message: "Error"});

}

}
var ConfirmationMail = function(req, res, next) {

  
    User.findOne({  confirmationCode: req.params.confirmationCode }, function(err, user) { // on cherche dans la BDD si le user passé existe ou pas 

        if (err) return res.status(500).send('Error on the server.'); //Si il y a un bug on renvoie une erreur 500
        if (!user) return res.status(404).send({ message: "Email incorrect" }); // si l'utilisateur n'existe pas on renvoie une réponse 404
        user.status = "Confirme";
        user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.status(200).send({ message:"Utilisateur a été confirmé" }); 

          });
        })
        .catch((e) => console.log("error", e));  
}
var demandeMotDePasseOublie =   function(req, res, next) {

  
    User.findOne({ $or: [{ email: req.body.email }, { username: req.body.email}] }, function(err, user) { // on cherche dans la BDD si le user passé existe ou pas 


        if (err) return res.status(500).send('Error on the server.'); //Si il y a un bug on renvoie une erreur 500
        if (!user) return res.status(404).send({ message: "Email incorrect" }); // si l'utilisateur n'existe pas on renvoie une réponse 404
        let token =  Token.findOne({ userId: user._id });
        if (token)
         token.deleteOne();
        let resetToken = crypto.randomBytes(32).toString("hex");
         const hash =   bcrypt.hash(resetToken, Number(bcryptSalt));

           new Token({
      userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();
        const link = `${config.appURL}/Authentification/changementPassword/${resetToken}/${user._id}`;
         if(EnvoieMail(req.body.email,"Mot de passe oublié","Mot de passe oublié",link))
        {
            res.status(201).json({message:"Mot de passe oublié a été envoyé"})

        }
        else{
            res.status(400).json({message:"Error envoie mail mot de passe oublié"})

        }

        
        
        })
        .catch((e) => console.log("error", e));  
}
var recoverMotPasse = function(req, res, next) {

    let passwordResetToken =   Token.findOne({ token: req.params.resetToken });
    if (!passwordResetToken) {
        res.status(401).json({message:"Token erroné"})
      }
      const isValid =   bcrypt.compare(passwordResetToken, passwordResetToken.token);
      if (!isValid) {
        res.status(401).json({message:"Token erroné ou expiré"})

      }
      const salt = bcrypt.genSaltSync(10);

      const hash = bcrypt.hashSync(req.body.password, salt);

    User.updateOne(
    { _id: req.params.id },
    { $set: { password: hash } },
    { new: true }
  ).then(function(u){
         
    const html ='<p> Bonjour,votre mot passe a été changé avec succées</p>'
    if(EnvoieMail(req.body.email,"Mot de passe changé","Mot de passe changé",html))
    {
        res.status(201).json({message:"Mot de passe a été changé avec succées",user:u})

    }
    else{
        res.status(400).json({message:"Erreur envoie mail",user:u})

    } })
 .catch(err => {
    console.log("Erreur changement mot de passe ...");

    console.log(err)
    if (err.code == 11000) {
        res.status(409).json({ message: "Utilisateur existe déjà" });

    } else {
        res.status(500).json({ message: "Internal Server Error" });
    }
}); 
}



function EnvoieMail(email,objet,text,html){
    var message = {

        // sender info
        from: config.gmail,

        
        to: email,

        // Subject of the message
        subject: objet,

        // plaintext body
        text: text,

        // HTML body
        html: html
    };
    var transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.gmail,
            pass: config.passwordGmail
        }
    });
    transport.sendMail(message, function(error, info) {
        console.log(error)
        if (error) {
           return false;
        }
        else{
            return true;
        }

    })
    return true;
}

module.exports = {
    LoginUser,
    InscriptionUser,
    ConfirmationMail,
    demandeMotDePasseOublie,
    recoverMotPasse
}