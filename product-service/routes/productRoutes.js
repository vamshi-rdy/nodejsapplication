const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json([
        { id: 1, name: 'iPhone 15' },
        { id: 2, name: 'MacBook Pro' }
    ]);
});

module.exports = router;
