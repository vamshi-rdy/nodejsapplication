const express = require('express');
const app = express();
// const productRoutes = require('./routes/productRoutes');  // uncomment ,if endpoints are used

// app.use('/api/products', productRoutes);                  // uncomment ,if endpoints are used

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});
