const express = require('express');
const router = express.Router();
const Document = require('../models/document');

// Function to generate the next document ID (optional if you want sequential IDs)
// If you're using MongoDB's default _id, you can skip this function
async function getNextDocumentId() {
    try {
        const documents = await Document.find();
        const maxId = documents.reduce((max, doc) => {
            return doc.id > max ? doc.id : max;
        }, 0);
        return maxId + 1;  // Increment the max ID by 1
    } catch (error) {
        console.error('Error fetching documents for ID generation:', error);
        throw error;  // Handle the error appropriately
    }
}

router.get('/', async (req, res, next) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error });
    }
});

router.post('/', async (req, res, next) => {
    // Log the incoming request to verify the request body
    console.log('Request Body:', req.body);

    try {
        // Get the next document ID (or use MongoDB auto-generated ID by skipping this line)
        const maxDocumentId = await getNextDocumentId();
        
        const document = new Document({
            id: maxDocumentId,  // Use the generated ID if you need sequential IDs, otherwise omit this line for auto ID
            name: req.body.name,
            description: req.body.description,
            url: req.body.url
        });

        await document.save();
        res.status(201).json({
            message: 'Document added successfully',
            document: document
        });
    } catch (error) {
        console.error('Error saving document:', error);  // Log error for better debugging
        res.status(500).json({
            message: 'An error occurred while saving the document.',
            error: error
        });
    }
});

router.put('/:id', (req, res, next) => {
    Document.findOne({ id: req.params.id })
      .then(document => {
        // Replace 'title' with 'name'
        document.name = req.body.name;
        document.description = req.body.description;
        document.url = req.body.url;
  
        Document.updateOne({ id: req.params.id }, document)
          .then(result => {
            res.status(204).json({
              message: 'Document updated successfully'
            });
          })
          .catch(error => {
            res.status(500).json({
                message: 'An error occurred while updating the document',
                error: error
            });
          });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Document not found.',
          error: { document: 'Document not found' }
        });
      });
});

router.delete("/:id", (req, res, next) => {
    Document.findOne({ id: req.params.id })
      .then(document => {
        Document.deleteOne({ id: req.params.id })
          .then(result => {
            res.status(204).json({
              message: "Document deleted successfully"
            });
          })
          .catch(error => {
            res.status(500).json({
                message: 'An error occurred while deleting the document',
                error: error
            });
          });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Document not found.',
          error: { document: 'Document not found' }
        });
      });
});

module.exports = router;
