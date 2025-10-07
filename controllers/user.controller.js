import { title } from "process";
import User from "../models/user.model.js";
import { body, validationResult } from "express-validator";

// Validation rules
export const validateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("role").notEmpty().withMessage("Role must be selected"),
];


export const userIndex = async (req, res) => {

    try {

        const { name, role } = req.query;
        const filter = {};

        // 🔍 Filter by name or email (case-insensitive)
        if (name && name.trim() !== '') {
          const regex = new RegExp(name.trim(), 'i');
          filter.$or = [{ name: regex }, { email: regex }];
        }

        // 🧑‍💼 Filter by role
        if (role && role.trim() !== '') {
          filter.role = role;
        }

        const users = await User.find(filter).sort({ createdAt: -1 });
        res.render("user/user-list", {
        title: "User List",
        users, // 👈 pass data to view
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }  
};

export const userAdd = (req, res) => {
    res.render('user/user-add', { title: 'Add New User' });
};

export const userCreate = async (req, res) => {
      console.log("Form Data:", req.body); // ✅ check if body data coming

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("user/user-add", {
      title: "Add New User",
      errors: errors.array(),
      old: req.body,
    });
  }

  try {
    const { name, email, role } = req.body;
        console.log("Saving User:", name, email, role); // ✅ debug line

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("user/user-add", {
        title: "Add New User",
        errors: [{ msg: "Email already exists" }],
        old: req.body,
      });
    }

    const newUser = new User({ name, email, role });
    await newUser.save();
    console.log("✅ User saved successfully!");

    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


export const userEdit = async (req, res) => {
    try{
        const id = req.params.id; // ✅ Get from URL (e.g. /users/edit/:id)
        const user = await User.findById(id); // ✅ Await the DB query

        if (!user) {
        return res.status(404).send("User not found");
        }

        res.render("user/user-edit",{
            title:"User Edit",
            user
        });
    } catch(err) {  
         console.error(err);
         res.status(500).send("Server Error");
    }
};


export const userUpdate = async (req, res) => {
  try {
    const { name, email, role, password, isActive } = req.body;
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.name = name;
    user.email = email;
    user.role = role;
    if (password) user.password = password; // update only if provided
    user.isActive = isActive === "on";

    await user.save();

    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const userView = async (req, res) => {
    try{
        const id = req.params.id; // ✅ Get from URL (e.g. /users/edit/:id)
        const user = await User.findById(id); // ✅ Await the DB query

        if (!user) {
        return res.status(404).send("User not found");
        }

        res.render("user/user-view",{
            title:"User View",
            user
        });
    } catch(err) {  
         console.error(err);
         res.status(500).send("Server Error");
    }
};

export const userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/users");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Server Error");
  }
};