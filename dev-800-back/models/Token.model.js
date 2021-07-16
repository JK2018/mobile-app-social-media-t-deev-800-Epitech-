const mongoose =require('mongoose')
const config =require('../settings/databaseconfig')
const TokenSchema=mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
      },
      token: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
      },
})
mongoose.Promise=global.Promise;
mongoose.connect(config.mongourl,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
module.exports = mongoose.model('TokenMotPasseOublie', TokenSchema);