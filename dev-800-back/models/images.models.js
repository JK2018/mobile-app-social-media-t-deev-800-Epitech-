const mongoose =require('mongoose')
const config =require('../settings/databaseconfig')
const ImageSchema=mongoose.Schema({
    title:{type:String},
    dateCreation:{type:Date},
    //cible:{type:String},
    hashtags:{type:[]},
    albumId:{  
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Albums",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    path: {type: String}
 
})
mongoose.Promise=global.Promise;
mongoose.connect(config.mongourl,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
module.exports = mongoose.model('Images', ImageSchema);