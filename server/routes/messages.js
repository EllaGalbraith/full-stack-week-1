const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const mongoose = require('mongoose');
const sequenceGenerator = require('../helpers/sequenceGenerator');

// GET all messages
router.get('/', async (req, res, next) => {
    try {
        const messages = await Message.find().populate('sender');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error });
    }
});

router.post('/', async (req, res) => {
    console.log("Incoming message data:", req.body);  // Log the received data

    if (!req.body.msgText) {
        return res.status(400).json({ error: "Message text is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.sender)) {
        return res.status(400).json({ error: "Invalid sender ObjectId!" });
    }

    const message = new Message({
        id: req.body.id,
        subject: req.body.subject,
        msgText: req.body.msgText,  // Ensure it matches the frontend field
        sender: new mongoose.Types.ObjectId(req.body.sender)  // Convert sender to ObjectId
    });

    try {
        const createdMessage = await message.save();
        res.status(201).json({
            message: 'Message added successfully',
            messageData: createdMessage
        });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: error.message });
    }
});



// PUT (update) a message by ID
router.put('/:id', async (req, res, next) => {
    try {
        const message = await Message.findOne({ id: req.params.id });

        if (!message) {
            return res.status(404).json({
                message: 'Message not found.',
                error: { message: 'Message not found' }
            });
        }

        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        message.sender = req.body.sender; // Should be an ObjectId referencing a Contact

        await Message.updateOne({ id: req.params.id }, message);
        res.status(204).json({ message: 'Message updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error });
    }
});

// DELETE a message by ID
router.delete("/:id", async (req, res, next) => {
    try {
        const message = await Message.findOne({ id: req.params.id });

        if (!message) {
            return res.status(404).json({
                message: 'Message not found.',
                error: { message: 'Message not found' }
            });
        }

        await Message.deleteOne({ id: req.params.id });
        res.status(204).json({ message: "Message deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error });
    }
});

module.exports = router;
