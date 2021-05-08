const express = require('express');
const { createUpdateUser } = require('../helpers/user_helper');
const router = express.Router();


const user_helper = require('../helpers/user_helper');



router.use(user_helper.init);



router.get('/list', user_helper.getUsers, (req, res) => {
  res.json(req.response);
});

router.post('/create', user_helper.validateData, user_helper.checkEmailExits, user_helper.createUpdateUser, (req, res) => {
  res.json(req.response);
});
router.post('/update', user_helper.validateUser, user_helper.validateData, user_helper.checkEmailExits, createUpdateUser, (req, res) => {
  res.json(req.response);
});

router.delete('/delete', user_helper.deleteUser, (req, res) => {
  res.json(req.response);
});

module.exports = router;
