const express = require('express');
const app = express();

app.get('/', {req, res} => res.send('Server is working correctly..!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server working in PORT ${PORT}`))