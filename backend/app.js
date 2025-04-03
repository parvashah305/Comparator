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




const express = require("express");
const cors = require("cors");
const compareRoutes = require("./routes/compareRoutes");
require("dotenv").config();

const app = express();

// CORS Configuration
// const allowedOrigins = [
//     "http://localhost:5173",
//     "https://comparator-five.vercel.app"
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true
// };

// app.use(cors(corsOptions));

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", compareRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));