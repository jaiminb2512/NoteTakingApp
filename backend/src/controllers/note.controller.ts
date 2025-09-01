import { Request, Response } from 'express';
import { NoteService } from '../services/note.service';
import ApiResponseUtil from '../utils/apiResponse';

export class NoteController {
    private noteService: NoteService;

    constructor() {
        this.noteService = new NoteService();
    }

    /**
     * Create a new note
     */
    createNote = async (req: Request, res: Response) => {
        try {
            const { content } = req.body;
            const userId = req.user?._id;

            if (!userId) {
                return ApiResponseUtil.unauthorized(res, 'User not authenticated');
            }

            const note = await this.noteService.createNote(userId, content);
            return ApiResponseUtil.created(res, note, 'Note created successfully');
        } catch (error) {
            return ApiResponseUtil.internalError(res, 'Error creating note', error as string);
        }
    };

    /**
     * Get all notes for the current user with pagination
     */
    getNotes = async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return ApiResponseUtil.unauthorized(res, 'User not authenticated');
            }

            // Get pagination parameters from query string
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            // Validate pagination parameters
            if (page < 1 || limit < 1 || limit > 100) {
                return ApiResponseUtil.badRequest(res, 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100');
            }

            const result = await this.noteService.getNotes(userId, page, limit);
            return ApiResponseUtil.paginated(
                res,
                result.notes,
                result.page,
                result.limit,
                result.total,
                'Notes retrieved successfully'
            );
        } catch (error) {
            return ApiResponseUtil.internalError(res, 'Error retrieving notes', error as string);
        }
    };

    /**
     * Get a specific note by ID
     */
    getNoteById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            if (!userId) {
                return ApiResponseUtil.unauthorized(res, 'User not authenticated');
            }

            const note = await this.noteService.getNoteById(id, userId);

            if (!note) {
                return ApiResponseUtil.notFound(res, 'Note not found');
            }

            return ApiResponseUtil.success(res, note, 'Note retrieved successfully');
        } catch (error) {
            return ApiResponseUtil.internalError(res, 'Error retrieving note', error as string);
        }
    };

    /**
     * Update a note
     */
    updateNote = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userId = req.user?._id;

            if (!userId) {
                return ApiResponseUtil.unauthorized(res, 'User not authenticated');
            }

            const updatedNote = await this.noteService.updateNote(id, userId, { content });

            if (!updatedNote) {
                return ApiResponseUtil.notFound(res, 'Note not found');
            }

            return ApiResponseUtil.success(res, updatedNote, 'Note updated successfully');
        } catch (error) {
            return ApiResponseUtil.internalError(res, 'Error updating note', error as string);
        }
    };

    /**
     * Delete a note
     */
    deleteNote = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            if (!userId) {
                return ApiResponseUtil.unauthorized(res, 'User not authenticated');
            }

            const isDeleted = await this.noteService.deleteNote(id, userId);

            if (!isDeleted) {
                return ApiResponseUtil.notFound(res, 'Note not found');
            }

            return ApiResponseUtil.success(res, null, 'Note deleted successfully');
        } catch (error) {
            return ApiResponseUtil.internalError(res, 'Error deleting note', error as string);
        }
    };
}