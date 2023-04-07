const express = require('express');
const Zone = require('../models/Zone');
const City = require('../models/City');


const zoneRouter = express.Router();

// create new zone
zoneRouter.post('/cities/:cityId/zones', (req, res) => {
    const { cityId } = req.params;
    const { name } = req.body;
    const zone = new Zone({ name, city: cityId });
    zone.save()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});
// get all zones
zoneRouter.get('/zones', (req, res, next) => {
    Zone.find().populate('city', 'name').find().then(zones => {
        res.json(zones)
    }).catch(err => res.status(500).json(err))
});
// get zone by id
zoneRouter.get('/zones/:id', (req, res, next) => {
    const id = req.params.id;
    Zone.findById(id).then(zone => res.json(zone)).catch(err => res.json(err));
});

// get all zones by city id
zoneRouter.get('/cities/:cityId/zones', (req, res) => {
    const { cityId } = req.params;
    Zone.find({ city: cityId })
        .then(zones => {
            res.json(zones);
        })
        .catch(err => {
            res.status(500).json(err)
        }
        );
});

// update zone
zoneRouter.put('/zones/:id', (req, res) => {
    const { id } = req.params;
    const { name, city } = req.body;
    Zone.findByIdAndUpdate(id, { name, city }, { new: true })
        .then(zone => {
            if (!zone) {
                return res.status(404).json({ error: 'Zone not found' });
            }
            res.json(zone);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});
// delete a zone
zoneRouter.delete('/zones/:id', (req, res) => {
    const { id } = req.params;
    Zone.findByIdAndDelete(id)
        .then(zone => {
            if (!zone) {
                return res.status(404).json({ error: 'Zone not found' });
            }
            res.json(zone);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});


zoneRouter.get('/zonespercity', (req, res) => {
    City.aggregate([
        {
            $lookup: {
                from: 'zones',
                localField: '_id',
                foreignField: 'city',
                as: 'zones',
            },
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                numberOfZones: { $sum: { $size: '$zones' } },
            },
        },
    ]).exec().then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).json(err);
    })
})

// zoneRouter.get('/zones/:name', (req, res, next) => {
//     const name = req.params.name;
//     Zone.findOne({name:name}).then(zone => res.json(zone)).catch(err => res.json(err));
// });



module.exports = zoneRouter;