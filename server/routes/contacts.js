const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const sequenceGenerator = require('../helpers/sequenceGenerator'); // Assuming you have a sequence generator

// GET all contacts
router.get('/', (req, res, next) => {
    Contact.find()
      .populate('group')
      .then(contacts => {
        res.status(200).json({
            message: 'Contacts fetched successfully!',
            contacts: contacts
          });
      })
      .catch(error => {
        res.status(500).json({
          message: 'An error occurred',
          error: error
        });
      });
});

// GET a single contact by custom 'id'
router.get('/:id', async (req, res, next) => {
    try {
        const contactId = req.params.id;

        // Find the contact using the custom 'id' instead of MongoDB's '_id'
        const contact = await Contact.findOne({ id: contactId }).populate('group');

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});




// POST a new contact with validation
router.post('/', async (req, res, next) => {
    if (!req.body.name || !req.body.email) {
        return res.status(400).json({
            message: 'Name and Email are required!'
        });
    }

    try {
        // Generate the next ID using your sequence generator
        const newId = await sequenceGenerator.nextId('contacts');

        const contact = new Contact({
            id: newId,  // Use the generated ID
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            imageUrl: req.body.imageUrl, // You can add the image URL as well if it's in the request body
            group: req.body.group || []  // Ensure group is provided or default to an empty array
        });

        const createdContact = await contact.save();
        res.status(201).json({
            message: 'Contact added successfully',
            contactData: createdContact
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error: error.message 
        });
    }
});


// PUT (update) a contact by custom 'id'
router.put('/:id', async (req, res, next) => {
    try {
        const contactId = req.params.id;

        // Find the contact by the custom 'id'
        const contact = await Contact.findOne({ id: contactId });

        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found.',
                error: { contact: 'Contact not found' }
            });
        }

        // Update the contact fields
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;

        await contact.save();  // Save the updated contact
        res.status(204).json({ message: 'Contact updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});


// DELETE a contact by custom 'id'
router.delete('/:id', async (req, res, next) => {
    try {
        const contactId = req.params.id;

        // Find the contact by the custom 'id'
        const contact = await Contact.findOne({ id: contactId });

        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found.',
                error: { contact: 'Contact not found' }
            });
        }

        // Delete the contact
        await Contact.deleteOne({ id: contactId });
        res.status(204).json({ message: 'Contact deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});


module.exports = router;