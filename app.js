const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('658ac1f0b325322a74141b53')
    .then(user => {
      if (!user) {
        // Handle the case where the user is not found
        return next(); // or handle it based on your application logic
      }

      req.user = new User({
        name: user.name,
        email: user.email,
        cart: user.cart,
        _id: user._id
      });

      next();
    })
    .catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://shivam:1234shivam@cluster0.ugn8rkz.mongodb.net/shop?retryWrites=true&w=majority"
    )
  .then(result => {
    // console.log('Connected to MongoDB');
    // const user=new User({
    //   name:"shivam",
    //   email:"shivam@gmail.com",
    //   cart:{
    //     items:[]
    //   }
    // })
    // user.save();
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
