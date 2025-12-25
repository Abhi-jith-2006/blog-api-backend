const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');

router.get('/protected-test', auth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

module.exports = router;
