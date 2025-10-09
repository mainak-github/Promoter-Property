const express = require('express');
const router = express.Router();
const { Lead } = require('../../../models'); // Assuming Lead model exists

// This route handles saving new lead data to the database.
// The email sending functionality has been removed as requested.
router.post('/leads', async (req, res) => {
  const { name, phone, email, message, propertyId, brokerId } = req.body;

  // Use a try...catch block to handle potential errors during the database operation.
  try {
    // Save the lead to the database using the Lead model.
    await Lead.create({
      name,
      phone,
      email,
      message,
      propertyId,
      brokerId: brokerId || null, // Ensure brokerId is null if not provided
    });

    // Send a success response if the lead is saved successfully.
    res.status(200).json({ message: 'Lead saved successfully!' });
  } catch (error) {
    // Log the error for debugging purposes.
    console.error('Error saving lead:', error);
    // Send an error response to the client.
    res.status(500).json({ message: 'Failed to save lead.' });
  }
});


// This new route fetches all leads from the database.
router.get('/leads', async (req, res) => {
  try {
    // Find all leads in the database.
    const allLeads = await Lead.findAll();

    // Send the retrieved leads as a JSON response.
    res.status(200).json(allLeads);
  } catch (error) {
    // Log the error for debugging purposes.
    console.error('Error fetching leads:', error);
    // Send an error response to the client.
    res.status(500).json({ message: 'Failed to fetch leads.' });
  }
});


module.exports = router;
