const app = require('./src/app');
const express = require('express');
const path = require('path');


app.use('/uploads', express.static(path.join(__dirname,  'uploads')));
app.use('/src/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// app.use('/src/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
