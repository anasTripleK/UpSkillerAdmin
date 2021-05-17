const express = require('express');
const app = express();
const router = express.Router();
const defectController = require('../defect/defectController');
const {authMW} = require('../../middleware/auth');
const roleMW = require('../../middleware/role');

// Note: There is next() in 1st(authMW)-and-2nd(roleMW) MiddleWare as they are followed by another MiddleWare.

// Add Defect
// POST
router.post('/addDefect', authMW, roleMW(['ADMIN']), defectController.addDefect);
// Change Defect Priority Level-Admin
// PUT
router.put('/changeDefectPriorityLevelAdmin', authMW, roleMW(['ADMIN']), defectController.changeDefectPriorityLevelAdmin)
// get All Defects
// GET
router.get('/getAllDefects', authMW, roleMW(['ADMIN']), defectController.getAllDefects);
// get Defect by Id
// GET
router.get('/getDefectById', authMW, roleMW(['ADMIN']), defectController.getDefectById);
// get Defect by Name
// GET
router.get('/getDefectByName', authMW, roleMW(['ADMIN']), defectController.getDefectByName);
// Disable a Defect
// PUT
router.put('/disableDefectAdmin', authMW, roleMW(['ADMIN']), defectController.disableDefectAdmin);

module.exports = router;