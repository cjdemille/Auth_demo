const express = require('express'); 
const app = express(); 
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/authDemo')
    .then(() =>{
        console.log("Mongo connection open")
    })
    .catch((err) => {
        console.log("there was an error"); 
        console.log(err);
    })

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'notagoodsecret', 
    resave: false, 
    saveUninitialized: false

})); 

const requireLogin = (req, res, next) =>{
    return !req.session.user_id ? res.redirect('/login') : next(); 
}

app.set('view engine' , 'ejs'); 
app.set('views' , 'views')

app.get('/' , (req, res) =>{
    res.send('this is a homepage')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register' , async(req, res) => {
    const {password , username } =req.body;
    const user = new User({ username, password })
    await user.save(); 
    req.session.user_id = user._id;
    res.redirect("/")
})

app.get('/login', (req, res) =>{
    res.render('login')
}); 

app.post('/login' , async(req, res) => {
    const { username , password } = req.body; 
    const foundUser = await User.findAndValidate(username, password)
    if (foundUser){
        req.session.user_id = foundUser._id;
        res.send("yay welcome");
    }  else{
        res.send('Try again');
    }
})

app.get('/secret', requireLogin , (req, res) => {
    res.render('secret')
})

app.get('/topsecret' , requireLogin , (req, res) =>{
    res.send('top secret'); 
})

app.post('/logout' , (req, res) =>{
    req.session.user_id = null; 
    res.redirect('/login');
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})