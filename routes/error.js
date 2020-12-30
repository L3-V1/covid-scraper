const express = require('express');

const router = express.Router();

router.all('/', (req, res) => {
    res.status(404);
    res.json({
        message:'Page not found'
    });
});

module.exports = router;