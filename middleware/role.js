//checks if role within decoded user object matches the one passed
// UPDATE through link below
// https://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api
// Array of Roles
module.exports = (role=[]) => {
  return (req, res, next) => {

    //if (req.user.role !== role) {
      if(role.length && !role.includes(req.user.role)){
        return res.status(401).json({ msg: 'User/Team Lead is not authorized' });
    }
    next();
  };
};
