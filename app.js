const express = require("express");
const userRoutes = require('./modules/auth/routes/auth.route');
const ticketRoutes = require('./modules/routes/ticketRoutes');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json()); 

// Route usage
app.use( userRoutes);
app.use( ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
