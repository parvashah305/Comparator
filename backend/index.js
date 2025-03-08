const express = require("express");
const cors = require("cors");
const extractRoutes = require("./routes/extractRoutes");

const app = express();
app.use(cors());
app.use("/api", extractRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));