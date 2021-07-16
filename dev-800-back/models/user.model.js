const mongoose =require('mongoose')
const config =require('../settings/databaseconfig')
const UserSchema=mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    nom: { type: String, required: false },
    prenom: { type: String, required: false },
    password: { type: String, required: true },
    imgProfile: { type: String, required: false },
    status: {
      type: String,
      enum: ['NonConfirme', 'Confirme'],
      default: 'NonConfirme'
    },
    confirmationCode: { 
      type: String, 
      unique: true
    },
})
mongoose.Promise=global.Promise;
mongoose.connect(config.mongourl,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
module.exports = mongoose.model('Users', UserSchema);