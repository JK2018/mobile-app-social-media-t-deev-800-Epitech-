var User = require('./models/user.model')
const jwt = require('jsonwebtoken');
const config = require('./settings/applicationconfig.json');


module.exports.verify = function(req, res, next) { //Verification de token 

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var token = req.headers['x-access-token']

    if (token) {
        try {
            var decoded = jwt.verify(token, config.secret);
            if (decoded) {
                User.findOne({ username: decoded.username }, function(err, user) {
                    if (err) {
                        res.status(401).json({ message: "Invalid Token " }); //Token inivalide
                    } else if (user) { //Utilisateur existe
                        next(); //On renvoie 
                    } else {
                        res.status(401).json({ message: "Invalid Token !" });//Utilisateur non trouvé lors de parsing de token
                    }
                });
            } else {
                res.status(401).json({ message: "Invalid Token !" });
            }

        } catch (err) {
            res.status(401).json({ message: 'Error Token ! 35' }); 
        }
    } else {
        res.status(401).json({ message: 'Veuillez passer le token d authentification' });
    }
}