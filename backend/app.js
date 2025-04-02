// const express = require("express");
// const cors = require("cors");
// const compareRoutes = require("./routes/compareRoutes");
// require("dotenv").config()

// const app = express();
// app.use(cors({
//     origin: "*", 
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"]
// }));

// // app.use(cors())
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));

// app.use("/api", compareRoutes);

// const PORT = process.env.PORT;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
const cors = require("cors");
const compareRoutes = require("./routes/compareRoutes");
require("dotenv").config();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: "https://comparator-five.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
app.use(cors(corsOptions));

// Handle Preflight Requests Manually
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api", compareRoutes);

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));