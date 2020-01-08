import verifyEmail from './verifyEmail';

const express = require('express');

const router = express.Router();

router.get('/verifyEmail', async (req, res) => {
  res.json({
    verified: await verifyEmail(req.query.verificationToken)
  });
});

export default router;
