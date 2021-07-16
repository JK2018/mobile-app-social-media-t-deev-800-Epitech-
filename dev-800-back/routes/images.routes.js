var express = require('express');
var router = express.Router();
var ImageGalleryController =require('../controllers/imageGalleryController')
const checkMiddleware = require('../policies');
const multer  = require('multer');

const filstorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        let _filename = file.originalname.replace(" ","");
        cb(null, Date.now()+"--"+_filename, cb);
    }
})


const upload = multer({ storage: filstorageEngine});

//router.use(checkMiddleware.verify);
router.post('/creerAlbum',ImageGalleryController.creerAlbum);
router.post('/saveImage', upload.single("image"),  ImageGalleryController.saveImage);
router.get('/getImageByAlbumId/', ImageGalleryController.getImageByAlbumId);
router.get('/search/', ImageGalleryController.search);

router.get('/getAllAlbum', ImageGalleryController.getAllAlbum);
router.post('/deleteAlbumById', ImageGalleryController.deleteAlbumById);
router.post('/deleteImageById', ImageGalleryController.deleteImageById);
router.post('/addFriendsToAlbum', ImageGalleryController.addFriendsToAlbum);
router.put('/updateAlbumById/:albumId', ImageGalleryController.updateAlbumById);
//https://startepich.waincorp.com

router.get('/testserver', ImageGalleryController.testserver);
module.exports = router;