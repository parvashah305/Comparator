const express = require("express");
const cors = require("cors");
const compareRoutes = require("./routes/compareRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", compareRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));