const express = require("express");
const cors = require("cors");
const compareRoutes = require("./routes/compareRoutes");
require("dotenv").config()

const app = express();
app.use(cors({
    origin:"https://comparator-five.vercel.app",
}));

// app.use(cors())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", compareRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));