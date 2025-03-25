const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String, required: true },
   email: { type: String },
   phone: { type: String },
   imageUrl: { type: String },
   group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }] // Assuming groups are related contacts
});

module.exports = mongoose.model('Contact', contactSchema);
