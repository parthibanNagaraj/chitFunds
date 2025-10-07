import express from "express";
import profileRoutes from "./routes/profile.route.js";
import userRoute from "./routes/user.route.js";
import memberRoute from "./routes/member.route.js";
import connectDB from "./database/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { format, addDays } from "date-fns";
import expressLayouts from "express-ejs-layouts"; // ✅ import the layout package
import methodOverride from "method-override";


const app = express();

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧩 ADD THESE TWO LINES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.locals.year = new Date().getFullYear();

// Connect DB
connectDB();

// Access the .env for entire project
app.locals.env = process.env;

// set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Enable layouts
app.use(expressLayouts);
app.set("layout", "layout/main")


// serve static files
app.use(express.static(path.join(__dirname, "public")));

//Method  overRiding
app.use(methodOverride("_method"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Dashboard" });
});

// CRUD Functionality for Profiles
app.use("/profiles", profileRoutes);

//User Module
app.use("/users", userRoute);

//Member Module
app.use("/members", memberRoute);



app.listen(8000, () => {
  console.log(`🚀 Server running at http://localhost:8000`);
});
