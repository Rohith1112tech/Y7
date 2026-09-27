import express from 'express';
import { createContact, getAllContacts, updateContactStatus, deleteContact } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createContact);
router.get('/', protect, getAllContacts);
router.put('/:id', protect, updateContactStatus);
router.delete('/:id', protect, deleteContact);

export default router;
