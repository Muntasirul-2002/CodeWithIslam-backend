const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://muntasirulmsd:muntasirulmsd@cluster0.fvf9q.mongodb.net/')
let userSchema = new mongoose.Schema({
    username: String,
    email:String,
    password:String,
    date:{
        type: Date,
        default: Date.now
    },
    isBlocked : {
        type: Boolean,
        default: false
    },
    isAdmin : {
        type: Boolean,
        default: false
    }

});
module.exports = mongoose.model("User", userSchema);