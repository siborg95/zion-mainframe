require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

mongoose.connect(
  "mongodb+srv://siborg95:f.97B.!c*4E%40WMn@cluster0.ovfkb6k.mongodb.net/zion-mainframe?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
