
import express from "express"

import { profileIndex, profileCreate, profileUpdate, profileDelete} from "../controllers/profile.controller.js"

const router = express.Router();

//CRUD Functionality for Profiles FameX

// List the Profiles 
router.get('/', profileIndex);

// Create the 
router.post('/', profileCreate);

//Update the Profile
router.put('/:id', profileUpdate);

//Delete the Profile
router.delete('/:id', profileDelete);

export default router;