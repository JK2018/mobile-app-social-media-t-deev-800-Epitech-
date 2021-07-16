const mongoose =require('mongoose')
const config =require('../settings/databaseconfig')
const AlbumSchema=mongoose.Schema({
      nomAlbum:{type:String ,required: true, unique: true } ,
      dateCreation:{type:Date},
      dateModification:{type:Date},
      hashtags:{type:[]},
      allowedUserId:{type:[]},
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
      },
})
mongoose.Promise=global.Promise;
mongoose.connect(config.mongourl,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
module.exports = mongoose.model('Albums', AlbumSchema);