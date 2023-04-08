const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var pharmacieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    garde: {
        type: String,
        enum: ['jour', 'nuit'],
        required: true,
    },
    images: [
        {
            url: {
                type: String,
            },
        }
    ],
    zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }
});


//Export the model
module.exports = mongoose.model('Pharmacie', pharmacieSchema);