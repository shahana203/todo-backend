const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
require('dotenv').config();

const app = express();
app.use(cors({
  origin:"*",
  methods:"GET,POST,PUT,DELETE",
  allowedHeaders:"Content-Type,Authorization",
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:',err));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
const PORT= process.env.PORT ||5002;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
});
