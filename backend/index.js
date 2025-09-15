const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const tenantRoutes = require("./routes/tenants");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);
app.use("/tenants", tenantRoutes);
app.use("/users", userRoutes);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error", err));

// for local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// for Vercel
module.exports = app;
