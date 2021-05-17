const express = require('express');
const app = express();
const router = express.Router();
const userController = require('../user/userController')
const {authMW} = require('../../middleware/auth');
const roleMW = require('../../middleware/role');

// ============= ADMIN ============

// DeleteUser/Admin
// DELETE
router.delete('/deleteUser',authMW, roleMW(['ADMIN']), userController.deleteUser);
// AddUser/Admin
// POST
router.post('/addUser', authMW, roleMW(['ADMIN']), userController.addUser);
// ResetUser_Password/Admin
// PUT
router.put('/resetPasswordAdmin', authMW, roleMW(['ADMIN']), userController.resetPasswordAdmin);
// UpdateUserProfile/Admin
// PUT
router.put('/updateUserProfileAdmin', authMW, roleMW(['ADMIN']), userController.updateUserProfileAdmin);
// ChangeUserAccessAdmin/Admin
// PUT
router.put('/changeUserAccessAdmin', authMW, roleMW(['ADMIN']), userController.changeUserAccessAdmin);
// getUserById/Admin
// GET
router.get('/getUserById', authMW, roleMW(['ADMIN']), userController.getUserById);
// getAllUsers/Admin
// GET
router.get('/getAllUsers', authMW, roleMW(['ADMIN']), userController.getAllUsers);
// getAllUsersTypeUser/Admin
// GET
router.get('/getAllUsersTypeUser', authMW, roleMW(['ADMIN']), userController.getAllUsersTypeUser);
// get User by UserName/Admin
// GET
router.get('/getUserByUserNameAdmin', authMW, roleMW(['ADMIN']), userController.getUserByUserNameAdmin);
// Block UserAccess/Admin
// Put
router.put('/blockUserAccessAdmin', authMW, roleMW(['ADMIN']), userController.blockUserAccessAdmin);

// ============= USER, ADMIN ============

// Login/Admin, User
// POST
router.post('/login', userController.Login);
// LogoutUser/Admin, User
// GET
router.get('/logout', authMW, userController.Logout);
// ResetUser_Password/Admin, User
// PUT
router.put('/resetPasswordUser', authMW, roleMW(['USER','ADMIN','LEAD']), userController.resetPasswordUser);
// UpdateUserProfile/Admin, User
// PUT
router.put('/updateUserProfile', authMW, roleMW(['USER','ADMIN','LEAD']), userController.updateUserProfile);

// Exporting Routes
module.exports = router;