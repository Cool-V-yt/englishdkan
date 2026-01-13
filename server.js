const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ REPLACE THIS with your actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://vw_w:Minecraftos@englishdkan.m0y0y3h.mongodb.net/?appName=englishdkan'; // or your Atlas URI

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// --- MONGODB SCHEMA ---
const dataSchema = new mongoose.Schema({
    products: { type: Array, default: [] },
    users: { type: Array, default: [] },
    sales: { type: Array, default: [] },
    returns: { type: Array, default: [] },
    config: { type: Object, default: { pass: '6677' } }
}, { timestamps: true });

const Data = mongoose.model('Data', dataSchema);

// --- CONNECT TO MONGODB ---
mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log("✅ Connected to MongoDB!");
        
        // Initialize with default data if empty
        const count = await Data.countDocuments();
        if (count === 0) {
            await Data.create({
                products: [],
                users: [],
                sales: [],
                returns: [],
                config: { pass: '6677' }
            });
            console.log("📝 Created initial data in MongoDB");
        }
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// --- API ROUTES ---

// 1. LOAD: Get data from MongoDB
app.get('/api/load', async (req, res) => {
    try {
        let data = await Data.findOne();
        if (!data) {
            // Create default if doesn't exist
            data = await Data.create({
                products: [],
                users: [],
                sales: [],
                returns: [],
                config: { pass: '6677' }
            });
        }
        
        // Ensure all fields exist
        const response = {
            products: data.products || [],
            users: data.users || [],
            sales: data.sales || [],
            returns: data.returns || [],
            config: data.config || { pass: '6677' }
        };
        
        res.json(response);
        console.log("📂 Data sent to a user");
    } catch (err) {
        console.error("Load error:", err);
        res.status(500).json({ error: "Failed to read data" });
    }
});

// 2. SAVE: Update data in MongoDB
app.post('/api/save', async (req, res) => {
    try {
        const { products, users, sales, returns, config } = req.body;
        
        // Find and update, or create if doesn't exist
        let data = await Data.findOne();
        if (data) {
            data.products = products || [];
            data.users = users || [];
            data.sales = sales || [];
            data.returns = returns || [];
            data.config = config || { pass: '6677' };
            await data.save();
        } else {
            await Data.create({ 
                products: products || [], 
                users: users || [], 
                sales: sales || [], 
                returns: returns || [],
                config: config || { pass: '6677' }
            });
        }
        
        console.log("💾 Data saved to MongoDB!");
        res.json({ success: true });
    } catch (err) {
        console.error("Save error:", err);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`
🌐 SERVER ONLINE (MongoDB Mode)
📍 Location: Iraq (Your Computer)
🔗 Link for Dad: https://englishdkan.serveo.net
🔗 Local: http://localhost:${PORT}
----------------------------------------------
Keep this window OPEN for your dad to access.
    `);

});
