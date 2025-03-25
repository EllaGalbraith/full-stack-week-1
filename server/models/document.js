const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String, required: true },
   description: { type: String },
   url: { type: String, required: true },
   group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }] // Assuming documents can belong to a group
});

module.exports = mongoose.model('Document', documentSchema);
