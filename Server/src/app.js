require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3330;
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const brokerRoutes = require('./routes/admin/broker.routes');
const publicPropertyRoutes = require('./routes/public/property.routes');
const adminPropertyRoutes = require('./routes/admin/property.routes');
const path = require('path');


const allowedOrigins = [
  'https://promoterproperty.com',
  'http://promoterproperty.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach(o => allowedOrigins.push(o.trim()));
}

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(
      allowedOrigins.indexOf(origin) !== -1 ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    ) {
      return callback(null, true);
    }
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());




// Root route
app.get('/', (req, res) => {
  res.send('😁 Promoter Property APIs 😁');
});

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/admin/brokers', brokerRoutes);
app.use('/api/admin/property',require('./routes/broker/propertyRoutes'))
app.use('/api/admin', adminPropertyRoutes);
app.use('/api/public', publicPropertyRoutes);
app.use('/api/admin', require('./routes/admin/faq.routes'));
app.use('/api/admin', require('./routes/admin/privacypolicy.routes'));
app.use('/api/admin', require('./routes/admin/tnc.routes'));
app.use('/api/admin', require('./controllers/admin/leads.controller'));
module.exports = app;
