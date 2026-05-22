require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const automoveisRoutes = require('./src/routes/automoveis.routes');
const estadiasRoutes = require('./src/routes/estadias.routes');

app.use('/automoveis', automoveisRoutes);
app.use('/estadias', estadiasRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;