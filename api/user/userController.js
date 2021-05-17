const user = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {userValidation, loginValidation} = require('../user/userValidation')
const { Roles, Jwt,Reset } = require('../../utils/constants');
const {addToken, expireToken}=require('../../middleware/auth');

// AddUser
addUser = async(req,res) =>{
  try{
          // User Valiation through Joi
          const {error} = userValidation(req.body);
          if(error) return res.status(400).send(error.details[0].message)

          // Check if User Already Exists
          const checkUser = await user.find({ "username" :req.body.username });
          if(checkUser == null || checkUser == undefined || checkUser.length == 0)
          {
            // Hashing The Password Below
            const salt= await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            roleAssigned=req.body.role.toUpperCase();
              const newUser = new user({
                  username: req.body.username,
                  password: hashedPassword,
                  role: roleAssigned,
                  // To Add Admin with any Role-Uncomment Below
                  //role: Roles.ADMIN
                  accessAllowed: true
              });

              // Below Saves the Credits to the DB using .save() of Mongoose
              await newUser.save();
              // No Token generated for the AddUser/SignUp as it will only be done by admin
              // Return/Response Statment below !
              return res.send('User/TL Added!');
         }
         else{
           // Error Status as a Response Below
              res.status(400).send('User Already Exists!');
          }

  }
  catch(error){
      console.log(error);
      return res.status()
  }
};

// Login
Login = async(req,res) =>{
  try{
          // Login Valiation through Joi
          const {error} = loginValidation(req.body);
          if(error) return res.status(400).send(error.details[0].message)

          // UserName Validation
          const checkUser = await user.findOne({ "username" :req.body.username });
          if(checkUser == null || checkUser == undefined) return res.status(400).send('Invalid Email/Password');
          // Password Validation
          const validPassword = await bcrypt.compare(req.body.password, checkUser.password);
          if(!validPassword) return res.status(400).send('Invalid Email/Password');

          if(!checkUser.accessAllowed){
            return res.status(403).send('Account Status: Blocked');
          }
          // Token will be generated here!
          // Send the Token below!
          // Token Expiration Time Allocated Below
          // ===================================
          // PayLoad constant for Token
          const payLoad = { user:{ id: checkUser._id, role: checkUser.role, accessAllowed: checkUser.accessAllowed } }; // User object's payLoad
          // jwtToken generated below for 60 seconds
          const TOKEN_SECRET = Jwt.SECRET;
          const jwtToken =   jwt.sign( payLoad, TOKEN_SECRET, {expiresIn: 60}/* ,CallBack Function */ );
          // ==========
          // Response of Login Below
          addToken(jwtToken);
          res.json({ jwtToken: jwtToken});
          //res.header('auth-token', jwtToken).send(jwtToken);
          //return res.send(checkUser)
          //return res.send('User/TL Logged In!');
  }
  catch(error){
      console.log(error);
      return res.status();
  }
};

// Logout
Logout = async(req,res) =>{
  try{
          const token2expire = req.header('x-auth-token');
          expireToken(token2expire);
          res.status(200).json({"logout":"true"});
  }
  catch(error){
      console.log(error);
      return res.status();
  }
};

//deleteUser
deleteUser = async(req, res)=>{
  try{
    // UserName Validation
    const checkUser = await user.findOne({ "username" :req.body.username });
    if(checkUser == null || checkUser == undefined) return res.status(404).send('Invalid UserName');
    // Below Returns the Complete Object Deleted, from Database
    await user.findOneAndDelete({_id: checkUser._id});
    res.status(200).json({"Message":"Requested User Deleted!"});
  }
  catch(error){
    console.log(error);
    return res.status();
  }
};

// resetPasswordAdmin
// This can reset password for anybody in the request body
// req.body to be evaluated
resetPasswordAdmin = async(req, res)=>{
  try{
    // UserName Validation
    const checkUser = await user.findOne({ "username" :req.body.username });
    if(checkUser == null || checkUser == undefined) return res.status(404).send('Invalid User');
    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Reset.PASSWORD, salt);
    // Below Returns the Complete Object UnUpdated, from Database and Updates afterwards
    await user.findOneAndUpdate({_id:checkUser.id},{password:hashedPassword});
    res.status(200).json({"Message":"User/Lead/Admin Password Updated!", "Updated Password":Reset.PASSWORD});
  }
  catch(error){
    console.log(error);
    return res.status();
  }
};

// resetPasswordUser
// This can only reset password for himself
// User Itself to be decoded
resetPasswordUser = async(req, res)=>{
  try{
    // Below Returns the Complete Object Deleted, from Database
    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Below Returns the Complete Object UnUpdated, from Database and Updates afterwards
    await user.findOneAndUpdate({_id:req.user.id},{password:hashedPassword});
    res.status(200).json({"Message":"Your Password Updated!", "Updated Password":req.body.password});
  }
  catch(error){
    console.log(error);
    return res.status();
  }
};

// updateUserProfileAdmin
// This API doesn't expects PASSWORD to be UPDATED ---------- NOTE -----------------
updateUserProfileAdmin = async(req, res) => {
  try{
    // UserName Validation
    const checkUser = await user.findOne({ "username" :req.body.username });
    if(checkUser == null || checkUser == undefined) return res.status(404).send('Invalid User');
    // checks on username
    if(req.body.usernameUP == "" || req.body.usernameUP == null || req.body.usernameUP == undefined || req.body.role == null || req.body.role == undefined || (req.body.role.toUpperCase() != 'ADMIN' && req.body.role.toUpperCase() != 'USER' && req.body.role.toUpperCase() != 'LEAD'))
    {
      return res.status(400).json({"New Username":"Must not be Empty!", "Roles":"Admin, User & Lead Allowed only!"})
    }
    else
    {
      if(!await user.findOne({ "username" :req.body.usernameUP }))
      {
        await user.findOneAndUpdate({_id:checkUser.id},{"username":req.body.usernameUP, "role":req.body.role.toUpperCase()});
        return res.status(200).json({"Message":"User/LD/Admin Updated!"});
      }
      else
      {
        return res.status(400).json({"Message":"This UserName not Allowed!"})
      }
    }
  }
  catch(error){
    console.log(error);
    return res.status();
  }
};

// updateUserProfile
// This allows admin/user to update their own profile(i.e. username only)
updateUserProfile = async(req, res)=>{
  try{
    // UserName Validation
    const checkUser = await user.findOne({ "username" :req.body.username });
    if(checkUser == null || checkUser == undefined) return res.status(404).send('Invalid User');
    //checkUser is updating himself only, not other user
    if(checkUser._id == req.user.id)
    {
      // checks on username
      if(req.body.usernameUP == "" || req.body.usernameUP == null || req.body.usernameUP == undefined)
      {
        return res.status(400).json({"New Username":"Must not be Empty!"})
      }
      else {
        if(!await user.findOne({ "username" :req.body.usernameUP }))
        {
          await user.findOneAndUpdate({_id:checkUser.id},{"username":req.body.usernameUP});
          return res.status(200).json({"Message":"User/Admin Updated!"});
        }
        else
        {
          return res.status(400).json({"Message":"This UserName not Allowed!"})
        }
      }
    }
    else
    {
      return res.status(401).json({"Security Alert": "Authorization denied. Trying to access, denied rights!" });
    }
  }
  catch(error){
    console.log(error);
    return res.status();
  }
};

changeUserAccessAdmin = async(req,res)=>{
  try{
    // UserName Validation
    const checkUser = await user.findOne({ "username" :req.body.username });
    if(checkUser == null || checkUser == undefined) return res.status(404).send('Invalid User');
    if((req.body.role == null || req.body.role == undefined || req.body.role == "") || (req.body.role.toUpperCase() != 'ADMIN' && req.body.role.toUpperCase() != 'USER' && req.body.role.toUpperCase() != 'LEAD' ))
    {
      return res.status(400).json({"Roles":"Admin, LD or User allowed only!"})
    }
    else{
      // Below Returns the Complete Object UnUpdated, from Database and Updates afterwards
      await user.findOneAndUpdate({_id:checkUser.id},{role:req.body.role.toUpperCase()});
      res.status(200).json({"Message":"User Role Updated!"});
    }
  }
  catch(error){
    console.log(error);
    return res.status();
  }
};

getUserById = async(req,res)=>{
  try{
    // Get User By ID
    await user.findById(req.query.id)
    .then(userObj => res.json({"id":userObj.id,"username":userObj.username,"role":userObj.role}))
    .catch(err => res.status(404).json({ Message: 'No User found' }));
  }
  catch(error){
    console.log(error);
    return res.status();
  }
};

getAllUsers = async(req,res)=>{
  try{
    // gets All Users
    await user.find()
    .then(userObj => res.json(userObj))
    .catch(err => res.status(404).json({ Message: 'No Users found' }));
  }
  catch(error){
    console.log(error);
    return res.status();
  }
};

getAllUsersTypeUser = async(req,res)=>{
  try{
    // gets All Users
    await user.find({"role":Roles.USER})
    .then(userObj => res.json(userObj.length==0?{"Message":"No USER Found!"}:{userObj}))
    .catch(err => res.status(404).json({ Message: 'No Users found' }));
  }
  catch(error){
    console.log(error);
    return res.status();
  }
};

getUserByUserNameAdmin = async(req,res) =>{
  try{
      // Get User By UserName-Admin Only
      await user.findOne({"username": req.query.username})
      .then(userObj => res.json({"id":userObj.id,"username":userObj.username,"role":userObj.role}))
      .catch(err => res.status(404).json({ Message: 'No User found' }));
    }
    catch(error){
      console.log(error);
      return res.status();
    }
}

blockUserAccessAdmin = async(req,res) =>{
  try{
      // UserName Validation
      const checkUser = await user.findOne({ "username" :req.body.username });
      if(checkUser == null || checkUser == undefined) return res.status(404).send('Invalid User');
      // Below Returns the Complete Object UnUpdated, from Database and Updates afterwards
      await user.findOneAndUpdate({_id:checkUser.id},{accessAllowed:false});
      res.status(200).json({"Message":"User Blocked!"});
  }
  catch(error){
    console.log(error);
    return res.status();
  }
}

module.exports = {
  addUser: addUser,
  Login: Login,
  Logout: Logout,
  deleteUser: deleteUser,
  resetPasswordAdmin: resetPasswordAdmin,
  resetPasswordUser: resetPasswordUser,
  updateUserProfile: updateUserProfile,
  updateUserProfileAdmin: updateUserProfileAdmin,
  changeUserAccessAdmin: changeUserAccessAdmin,
  getUserById:getUserById,
  getAllUsers:getAllUsers,
  getAllUsersTypeUser:getAllUsersTypeUser,
  getUserByUserNameAdmin:getUserByUserNameAdmin,
  blockUserAccessAdmin: blockUserAccessAdmin
};
