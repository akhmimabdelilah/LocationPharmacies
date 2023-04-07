const express = require('express');
const City = require('../models/City');


const cityRouter = express.Router();

// create new city
cityRouter.post('/cities', (req, res) => {
    const { name, zones } = req.body;
    const city = new City({ name, zones });
    city.save()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

// get all cities
cityRouter.get('/cities', (req, res, next) => {
    City.find().then(cities => {
        res.json(cities)
    }).catch(err => res.json(err))
});
// get city by id
cityRouter.get('/cities/:id', (req, res, next) => {
    const id = req.params.id;
    City.findById(id).then(city => res.json(city)).catch(err => res.json(err));
});
// update city
cityRouter.put('/cities/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    City.findByIdAndUpdate(id, { name }, { new: true })
        .then(city => {
            if (!city) {
                return res.status(404).json({ error: 'City not found' });
            }
            res.json(city);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});
// delete a city
cityRouter.delete('/cities/:id', (req, res) => {
    const { id } = req.params;
    City.findByIdAndDelete(id)
        .then(city => {
            if (!city) {
                return res.status(404).json({ error: 'City not found' });
            }
            res.json(city);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

// cityRouter.get('/cities/:name', (req, res, next) => {
//     const name = req.params.name;
//     City.findOne({name:name}).then(city => res.json(city)).catch(err => res.json(err));
// });



module.exports = cityRouter;
