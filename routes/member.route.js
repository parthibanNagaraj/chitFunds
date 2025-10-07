
import express from "express"

import { userIndex, userAdd, validateUser, userCreate, userEdit, userUpdate, userView, userDelete} from "../controllers/user.controller.js"

const router = express.Router();

//CRUD Functionality for users FameX

// List the users 
router.get('/', userIndex);

// List the users Add 
router.get('/add', userAdd);

// Create the 
router.post('/', validateUser, userCreate);

//Edit User
router.get('/:id/edit', userEdit);

//Update the user
router.put('/:id/update', userUpdate);

//User View
router.get('/:id/view', userView);

//Delete the user
router.delete('/:id/delete', userDelete);

export default router;