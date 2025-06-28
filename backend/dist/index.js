"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const my_hotels_1 = __importDefault(require("./routes/my-hotels"));
const hotels_1 = __importDefault(require("./routes/hotels"));
const my_bookings_1 = __importDefault(require("./routes/my-bookings"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING);
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)()); // f) checking user cookie login state
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    // b) Checking user cookie login state
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
// serve frontend
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
// routes
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/my-hotels", my_hotels_1.default);
app.use("/api/hotels", hotels_1.default);
app.use("/api/my-bookings", my_bookings_1.default);
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/dist/index.html"));
});
const port = process.env.PORT || 7000;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
