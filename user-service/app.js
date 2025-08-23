const express = require('express');
const app = express();
// const userRoutes = require('./routes/userRoutes');  // uncomment ,if endpoints are used

// app.use('/api/users', userRoutes);  // uncomment ,if endpoints are used

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
