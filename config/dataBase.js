const mongoose = require('mongoose');
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://testUser:123456testUser@clusterzero.j5w7v.mongodb.net/upskillerdb?retryWrites=true&w=majority', // replaced 'connection string' with env. variable
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    );
    console.log('MongoDB Connected');
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
