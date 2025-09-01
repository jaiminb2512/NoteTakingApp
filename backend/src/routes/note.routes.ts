import { Router } from 'express';
import { NoteController } from '../controllers/note.controller';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body, param } from 'express-validator';

const router = Router();
const noteController = new NoteController();

// Validation middleware
const validateNoteCreate = validate([
    body('content').trim().notEmpty().withMessage('Content is required')
]);

const validateNoteUpdate = validate([
    param('id').isMongoId().withMessage('Invalid note ID'),
    body('content').trim().notEmpty().withMessage('Content is required')
]);

const validateNoteId = validate([
    param('id').isMongoId().withMessage('Invalid note ID')
]);

// Routes
router.post('/', auth, validateNoteCreate, noteController.createNote);
router.get('/', auth, noteController.getNotes);
router.get('/:id', auth, validateNoteId, noteController.getNoteById);
router.put('/:id', auth, validateNoteUpdate, noteController.updateNote);
router.delete('/:id', auth, validateNoteId, noteController.deleteNote);

export default router;