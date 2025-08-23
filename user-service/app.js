const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
