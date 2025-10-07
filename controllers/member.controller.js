import { title } from "process";
import Member from "../models/member.model.js";
import { body, validationResult } from "express-validator";

// Validation rules
export const validateMember = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("role").notEmpty().withMessage("Role must be selected"),
];


export const memberIndex = async (req, res) => {

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

        const members = await member.find(filter).sort({ createdAt: -1 });
        res.render("member/member-list", {
        title: "member List",
        members, // 👈 pass data to view
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }  
};

export const memberAdd = (req, res) => {
    res.render('member/member-add', { title: 'Add New member' });
};

export const memberCreate = async (req, res) => {
      console.log("Form Data:", req.body); // ✅ check if body data coming

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("member/member-add", {
      title: "Add New member",
      errors: errors.array(),
      old: req.body,
    });
  }

  try {
    const { name, email, role } = req.body;
        console.log("Saving member:", name, email, role); // ✅ debug line

    // Check if email already exists
    const existingmember = await member.findOne({ email });
    if (existingmember) {
      return res.status(400).render("member/member-add", {
        title: "Add New member",
        errors: [{ msg: "Email already exists" }],
        old: req.body,
      });
    }

    const newmember = new member({ name, email, role });
    await newmember.save();
    console.log("✅ member saved successfully!");

    res.redirect("/members");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


export const memberEdit = async (req, res) => {
    try{
        const id = req.params.id; // ✅ Get from URL (e.g. /members/edit/:id)
        const member = await member.findById(id); // ✅ Await the DB query

        if (!member) {
        return res.status(404).send("member not found");
        }

        res.render("member/member-edit",{
            title:"member Edit",
            member
        });
    } catch(err) {  
         console.error(err);
         res.status(500).send("Server Error");
    }
};


export const memberUpdate = async (req, res) => {
  try {
    const { name, email, role, password, isActive } = req.body;
    const id = req.params.id;

    const member = await member.findById(id);
    if (!member) {
      return res.status(404).send("member not found");
    }

    member.name = name;
    member.email = email;
    member.role = role;
    if (password) member.password = password; // update only if provided
    member.isActive = isActive === "on";

    await member.save();

    res.redirect("/members");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const memberView = async (req, res) => {
    try{
        const id = req.params.id; // ✅ Get from URL (e.g. /members/edit/:id)
        const member = await member.findById(id); // ✅ Await the DB query

        if (!member) {
        return res.status(404).send("member not found");
        }

        res.render("member/member-view",{
            title:"member View",
            member
        });
    } catch(err) {  
         console.error(err);
         res.status(500).send("Server Error");
    }
};

export const memberDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await member.findByIdAndDelete(id);
    res.redirect("/members");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Server Error");
  }
};