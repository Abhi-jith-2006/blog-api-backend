const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const {registerValidator , loginValidator} = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');


router.post('/register' , registerValidator , validate , authController.register);
router.post('/login' , loginValidator , validate ,authController.login);

module.exports = router;

