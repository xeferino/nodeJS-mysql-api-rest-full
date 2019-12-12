const { Router } = require('express');
const router = Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', isNotLoggedIn, (req, res) => {});

router.get('/add', isLoggedIn, (req, res) => {
    res.render('weapons/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title } = req.body;
    const weaponsNew = { 
        title,
        id_user: req.user.id
    };
    if(!req.body.title){
        req.flash('message', 'The Name is Requerid');
        res.redirect('/api-weapons/add');
    }else {
        await pool.query('INSERT INTO weapons set ?', [weaponsNew]);
        req.flash('success', 'weapons saved successfully');
        res.redirect('/api-weapons/list');
    }
    console.log(req.body);
});

router.get('/list', isLoggedIn, async (req, res) => {
    const weapons = await pool.query('SELECT * FROM weapons WHERE id_user = ?', [req.user.id]);
    console.log(weapons);
    res.render('weapons/list', { weapons });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if(!req.params.id){
        req.flash('message', 'Error');
        res.redirect('/api-weapons/list');
    }
    const rows = await pool.query('SELECT id FROM weapons WHERE id = ?',[id]);
    if (rows.length>0) {
        await pool.query('DELETE FROM weapons WHERE id = ?',[id]);
        req.flash('success', 'weapons deleted successfully');
        res.redirect('/api-weapons/list');
    } else {
        req.flash('message', 'Error, while trying to remove weapons');
        res.redirect('/api-weapons/list');
    }
});

router.get('/update/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const weapons = await pool.query('SELECT * FROM weapons WHERE id = ?',[id]);
    res.render('weapons/edit', { data: weapons[0] });
});

router.post('/update/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const weaponsNew = { title };
    if(!req.body.title){
        req.flash('message', 'The Name is Requerid');
        res.redirect('/api-weapons/update/'+[id]);
    }else {
        const rows = await pool.query('SELECT id FROM weapons WHERE id = ?',[id]);
        if (rows.length>0) {
            await pool.query('UPDATE weapons set ? WHERE id = ?',[weaponsNew, id]);
            req.flash('success', 'weapons updated successfully');
            res.redirect('/api-weapons/list');
        }else {
            req.flash('message', 'Error, while trying to updated weapons');
            res.redirect('/api-weapons/list');
        }
    }
});

module.exports = router;