const express = require('express');
const Pharmacie = require('../models/Pharmacie');
const City = require('../models/City');
const Zone = require('../models/Zone');


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

// get pharmacy by zone
pharmacieRouter.get('/pharmacies/zone/:zone', async (req, res, next) => {
    try {
        console.log(req.params.zone);
        const pharmacies = await Pharmacie.find({ zone: req.params.zone });
        console.log(pharmacies);
        if (!pharmacies) {
            return res.status(404).json({ msg: 'Pharmacie not found' });
        }
        res.json(pharmacies);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Pharmacie not found' });
        }
        res.status(500).send('Server Error');
    }
});


pharmacieRouter.get('/pharmacies/city/:cityName', async (req, res) => {
    try {
        const cityName = req.params.cityName;

        const city = await City.findOne({ name: cityName });

        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        const zones = await Zone.find({ city: city._id });

        const pharmacies = await Pharmacie.find({ zone: { $in: zones } });

        res.json({ pharmacies });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

pharmacieRouter.get('/pharmacies/garde/:garde', async (req, res) => {
    const garde = req.params.garde;

    try {
        const pharmacies = await Pharmacie.find({ garde: garde });
        res.json(pharmacies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

pharmacieRouter.get('/pharmacies/:garde/:zone/:city', async (req, res) => {
    const garde = req.params.garde;
    const zone = req.params.zone;
    const city = req.params.city;
  
    try {
      const pharmacies = await Pharmacie.find({ garde: garde, zone: zone })
        .populate({
          path: 'zone',
          match: { city: city }
        })
        .exec();
  
      const filteredPharmacies = pharmacies.filter((pharmacy) => {
        return pharmacy.zone !== null;
      });
  
      res.json(filteredPharmacies);
    } catch (err) {
      console.error(err.message);
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
