const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var citySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    zones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }]
});


//Export the model
module.exports = mongoose.model('City', citySchema);