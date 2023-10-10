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

}))

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
    const hash = await bcrypt.hash(password, 12); 
    const user = new User({
        username, 
        password: hash
    })
    await user.save(); 
    res.redirect("/")
})

app.get('/login', (req, res) =>{
    res.render('login')
}); 

app.post('/login' , async(req, res) => {
    const { username , password } = req.body; 
    const user = await User.findOne({ username }); 
    const validPW = await bcrypt.compare(password , user.password); 
    if (validPW){
        req.session.user_id = user._id;
        res.send("yay welcome");

    } else{
        res.send('Try again');
    }

})



app.get('/secret' ,(req, res) => {
    if(!req.session.user_id_){
        res.redirect('/login');
    } else{
        res.send('This is a secret!');
    }

})

app.listen(3000, () => {
    console.log('listening on port 3000');
})