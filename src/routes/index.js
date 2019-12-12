var { Router } = require('express');
var router = Router();

router.get('/', (req, res) => {
    res.render('index.hbs');
});
module.exports = router;