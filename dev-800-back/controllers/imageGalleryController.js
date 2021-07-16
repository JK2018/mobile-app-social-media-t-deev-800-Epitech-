const TableUser = require('../models/user.model');
const TableAlbum = require('../models/album.model');
const config =require('../settings/applicationconfig.json')
const jwt = require('jsonwebtoken');
const imagesModels = require('../models/images.models');
const albumModel = require('../models/album.model');



//Controlleur Album:
var creerAlbum = function(req, res, next) { //Méthode pour créer un album dans la BDD
    var token = req.headers['x-access-token']
    if (token) {
        var decoded = jwt.verify(token, config.secret);
        if (decoded) {
            TableUser.findOne({ username: decoded.username }, function(err, user) { // On récupère l'utilisateur qui a appelé cette methode
                var nomAlbum=req.body.nomAlbum;//On récupère le nom de l'album à partir de l'appelle JSON effectué
                var hastags=req.body.hashtags;
                var tableAlbum = new TableAlbum({
                    nomAlbum: nomAlbum,
                    dateCreation:Date.now(),
                    dateModification:Date.now(),
                    hastags:req.body.hashtags,
                    userId:user._id            
                 });
                 tableAlbum.save().then(function(tableAlmbusauvgarde){
                    res.status(201).json({ message: "Album est crée" }); //En cas de succées          
                    })
                 .catch(err => {//en cas échoué
                    if (err.code == 11000) {
                        res.status(409).json({ message: "Nom album existe déjà" });
            
                    } else {
                        res.status(500).json({ message: "erreur lors de l'enregistrement" });
                    }  

   
            });
        })
    }  
      
    }
}
var getAllAlbum = function(req, res, next){ //Méthode qui renvoie la liste des album de l'utilisateur qui a appelé la méthode qui existe dans la BDD
    var token = req.headers['x-access-token']
    if (token) {
        var decoded = jwt.verify(token, config.secret);
        if (decoded) {
            
            TableUser.findOne({ username: decoded.username }, async function(err, user) { // On récupère l'utilisateur qui a appelé cette methode
                const tableQuery= await TableAlbum.find({userId:user._id});
                const albumPartage= await TableAlbum.find({allowedUserId:user.email});
             
                var listAlbum =[];
                var listAlbumPartage =[];

                tableQuery.forEach((alb)=>{
                    listAlbum.push(alb)
                  
                });
                albumPartage.forEach((alb)=>{
                    listAlbumPartage.push(alb)

                  
                });
              
                 console.log(albumPartage)
                res.status(200).json({ listAlbum:listAlbum,listAlbumPartage:listAlbumPartage }); //En cas de succées      
           
        })
        }
    }
}
var saveImage = (req,res,next)=>{
    console.log(req.file);
    let image = imagesModels();
    //let uri = "https://dev-800.herokuapp.com/";
    let uri = "http://startepich.waincorp.com/";
    image.title = req.body.title;
    image.dateCreation = Date.now();
    image.albumId = req.body.albumId;
    image.userId = req.body.userId;
    if(req.file === undefined){
        return res.status(400).json({
            message: "You need to select image"
        })
    }

    image.path = uri+req.file.path;
    console.log(image.title);
    console.log(image.path);
    console.log(req.file.path);
    image.save( err => {
        if(err){
            console.log(err);
            return res.status(500).json({message: "Image saved failed 500"})
        }
        return res.status(200).json({
            message: "Image has been saved"
        })
    })
}

var getImageByAlbumId = (req,res,next)=>{
      var albumID=req.query.albumId //On va récupèrer l'id de l'album à partir du lien
     var token = req.headers['x-access-token'] //Vérifier l'utilisateur connecté
     if (token) { //Si le token existe dans la requete
        var decoded = jwt.verify(token, config.secret);
        if (decoded) { //Si l'utilisateur de ce token existe dans notre système
            TableUser.findOne({ username: decoded.username }, function(err, user) { // On récupère l'utilisateur qui a appelé cette methode
                imagesModels.find({userId:user._id,albumId:albumID}).then(function(imageListe){ //on va chercher les albums avec l'id de user égale le user appelant
                    res.status(200).json({ listImage:imageListe }); //En cas de succées          
                })
                 .catch(err => {//en cas échoué
                    res.status(500).json({ message: "Récupèration échoué" });
            });
        })
        }
    }
}
var search = (req,res,next)=>{
    var textfield=req.query.textfield //On va récupèrer l'id de l'album à partir du lien
    console.log("ok -> " +req.query.textfield);
   var token = req.headers['x-access-token'] //Vérifier l'utilisateur connecté
   if (token) { //Si le token existe dans la requete
      var decoded = jwt.verify(token, config.secret);
      if (decoded) { //Si l'utilisateur de ce token existe dans notre système
          TableUser.findOne({ username: decoded.username }, function(err, user) { // On récupère l'utilisateur qui a appelé cette methode
               
            TableAlbum.find({userId:user._id,nomAlbum:{ "$regex": textfield, "$options": "i" }}).then(function(albumlist){ //on va chercher les albums avec l'id de user égale le user appelant + recherche des noms
                  res.status(200).json({ albumlist:albumlist }); //En cas de succées          
              })
               .catch(err => {//en cas échoué
                  res.status(500).json({ message: "Récupèration échoué" });
          });
      })
      }
  }
}
var testserver = (req,res,next)=>{
    return res.status(200).json({
        message: "ServerWork"
    })
}
var deleteImageById = (req,res,next)=>{
    var imageID=req.body.imageId //On va récupèrer l'id de l'image à supprimer
   var token = req.headers['x-access-token'] //Vérifier l'utilisateur connecté
   if (token) { //Si le token existe dans la requete
      var decoded = jwt.verify(token, config.secret);
      if (decoded) { //Si l'utilisateur de ce token existe dans notre système
          TableUser.findOne({ username: decoded.username }, function(err, user) { // On récupère l'utilisateur qui a appelé cette methode
               if(user){
            imagesModels.remove({ _id: imageID }, function(err) {
                if (err) {
                    res.status(400).json({message:"Image deleting error"}) // Opération a été échouté
                }
                else {
                    res.status(200).json({message:"Image has been delete"}); //Image supprimé
                }
            });
        }
        else{
            res.status(404).json({message:"User not find"}) // Utilisateur non trouvé dans la BDD

        }
      })
    }
  }
}
var deleteAlbumById = (req,res,next)=>{
    var albumId=req.body.albumdId //On va récupèrer l'id de l'album à supprimer
   var token = req.headers['x-access-token'] //Vérifier l'utilisateur connecté
   if (token) { //Si le token existe dans la requete
      var decoded = jwt.verify(token, config.secret);
      if (decoded) { //Si l'utilisateur de ce token existe dans notre système
          TableUser.findOne({ username: decoded.username }, function(err, user) { // On récupère l'utilisateur qui a appelé cette methode
               if(user){
            albumModel.remove({ _id: albumId }, function(err) {
                if (err) {
                    res.status(400).json({message:"Error during delete"}) // Opération a été échouté
                }
                else {
                    res.status(200).json({message:"Album has been delete"}); //Image supprimé
                }
            });
        }
        else{
            res.status(404).json({message:"User doesn't exist"}) // Utilisateur non trouvé dans la BDD
        } 
      })
    }
  }
}
var addFriendsToAlbum = (req,res,next)=>{
    var friendEmail=req.body.email //On va récupèrer l'email à ajouter dans la liste à partager
    var albumdId=req.body.albumdId
   var token = req.headers['x-access-token'] //Vérifier l'utilisateur connecté
   if (token) { //Si le token existe dans la requete
      var decoded = jwt.verify(token, config.secret);
      if (decoded) { //Si l'utilisateur de ce token existe dans notre système
          TableUser.findOne({ username: decoded.username }, function(err, user) { // On récupère l'utilisateur qui a appelé cette methode
               if(user){
                    albumModel.updateOne({ _id: albumdId}, {$push:{allowedUserId:friendEmail}},function(err) {
                if (err) {
                        res.status(400).json({message:"Add friend Failed 400"}) // Opération a été échouté
                }
                else {
                    res.status(200).json({message:friendEmail + " a été ajouté avec succès "}); //Firend Email ajouté
                }
            });
        }
        else{
            res.status(404).json({message:"Add friend Failed 404"}) // Utilisateur non trouvé dans la BDD
        }
      })
    }
  }

}
var updateAlbumById = (req,res,next)=>{
    var albumId=req.params.albumId //On va récupèrer l'id de l'album à partir de l'url
    var objetAlbum=req.body; //On récupére l'album à partir de l'objet JSON
     var token = req.headers['x-access-token'] //Vérifier l'utilisateur connecté
   if (token) { //Si le token existe dans la requete
      var decoded = jwt.verify(token, config.secret);
      if (decoded) { //Si l'utilisateur de ce token existe dans notre système
          TableUser.findOne({ username: decoded.username }, async function(err, user) { // On récupère l'utilisateur qui a appelé cette methode
               if(user){
                const tableQuery= await TableAlbum.findOne({userId:user._id,_id: albumId });
                if(!tableQuery){ //Si l'album n'appartien pas à l'utilisateur alors on renvoie une erreur (sécurité)
                    res.status(500).json({message:"Vous n'avez pas le droit pour modifier"}) // On renvoie une erreur
                }else{
                   // res.status(200).json( {message:"Image a été supprimé avec succées"}); //Image supprimé
                   
                  const toupdate={nomAlbum:objetAlbum.nomAlbum,hashtags:objetAlbum.hashtags,allowedUserId:objetAlbum.allowedUserId,dateModification:Date.now()}
                  let updatedAlbum = await TableAlbum.findOneAndUpdate({_id:albumId}, toupdate, {
                    new: true,
                    upsert: true 
                  });
                  if(updatedAlbum){
                   res.status(200).json( {message:"Album a été modifié avec succée"}); //Response Ok

                  }
                }
            
        }
        else{
            res.status(404).json() // Utilisateur non trouvé dans la BDD

        }

 
      })
      }
  }

}
module.exports = {
    creerAlbum,
    getImageByAlbumId,
    saveImage,
    testserver,
    getAllAlbum,
    deleteImageById,
    deleteAlbumById,
    addFriendsToAlbum,
    updateAlbumById,
    search
}
