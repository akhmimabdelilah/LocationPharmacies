const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var zoneSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' }
});


//Export the model
module.exports = mongoose.model('Zone', zoneSchema);