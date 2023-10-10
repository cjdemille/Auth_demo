const mongoose = require('mongoose'); 
const {Schema }  = mongoose; 

const userSchema = new Schema({
    username:{
        type: String, 
        required:[true, 'Username cannot be blank']
    } ,
    password:{
        type: String, 
        required:[true, 'Password cannot be blank']
    },
})

const User = mongoose.model('User', userSchema); 

module.exports = User;