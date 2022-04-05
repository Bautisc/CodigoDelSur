//Importando modulos.
const express = require("express");
const movieHandler = require("./routes/movies");
const userHandler = require("./routes/users");

//Seteando App
const app = express();

const PORT = 1080;
//=== USER ENDPOINTS ===//
app.use("/api", userHandler);

//=== MOVIE ENDPOINTS ===//
app.use("/movies", movieHandler);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
