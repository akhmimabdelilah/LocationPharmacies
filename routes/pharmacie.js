const express = require('express');
const Pharmacie = require('../models/Pharmacie');


const pharmacieRouter = express.Router();

// create new city
pharmacieRouter.post('/pharmacies', (req, res) => {
    console.log(req.body);
    const pharmacie = new Pharmacie(req.body);
    pharmacie.save()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });

});
// get all pharmacies
pharmacieRouter.get('/pharmacies', (req, res, next) => {
    Pharmacie.find().then(pharmacies => {
        res.json(pharmacies)
    }).catch(err => res.status(500).json(err.message))
});
// get pharmacy by id
pharmacieRouter.get('/pharmacies/:id', async (req, res, next) => {
    try {
        const pharmacie = await Pharmacie.findById(req.params.id);
        if (!pharmacie) {
            return res.status(404).json({ msg: 'Pharmacie not found' });
        }
        res.json(pharmacie);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Pharmacie not found' });
        }
        res.status(500).send('Server Error');
    }
});

pharmacieRouter.put('/pharmacies/:id', async (req, res) => {
    try {
        const pharmacie = await Pharmacie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pharmacie) {
            return res.status(404).json({ msg: 'Pharmacie not found' });
        }
        res.json(pharmacie);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Pharmacie not found' });
        }
        res.status(500).send('Server Error');
    }
});

pharmacieRouter.delete('/pharmacies/:id', async (req, res) => {
    try {
        const pharmacie = await Pharmacie.findById(req.params.id);
        if (!pharmacie) {
            return res.status(404).json({ msg: 'Pharmacie not found' });
        }
        await Pharmacie.deleteOne(pharmacie);
        res.json({ msg: 'Pharmacie removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Pharmacie not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = pharmacieRouter;
