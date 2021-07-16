var express = require('express');
var router = express.Router();

module.exports = router => {
    
    router.use('/Authentification',require('./authentification.routes'))
    router.use('/gallery',require('./images.routes'))

}