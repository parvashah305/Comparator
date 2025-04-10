// const express = require("express");
// const cors = require("cors");
// const compareRoutes = require("./routes/compareRoutes");
// require("dotenv").config()

// const app = express();
// // app.use(cors({
// //     origin: "*", 
// //     methods: ["GET", "POST"],
// //     allowedHeaders: ["Content-Type"]
// // }));

// app.use(cors())

// // app.use(cors())
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));

// app.use("/api", compareRoutes);

// const PORT = process.env.PORT;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compareRoutes = require("./routes/compareRoutes");
const summarizeRoutes = require("./routes/summarizeRoute");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", compareRoutes);
app.use('/api',summarizeRoutes)

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));