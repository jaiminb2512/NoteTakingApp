import { Types } from 'mongoose';
import { Note, INote } from '../models/Note';

interface PaginatedNotes {
    notes: INote[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class NoteService {
    /**
     * Create a new note
     */
    async createNote(userId: string, content: string): Promise<INote> {
        const note = new Note({
            content,
            user: new Types.ObjectId(userId)
        });
        return await note.save();
    }

    /**
     * Get all notes for a user with pagination
     */
    async getNotes(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedNotes> {
        const skip = (page - 1) * limit;

        const [notes, total] = await Promise.all([
            Note.find({ user: new Types.ObjectId(userId) })
                .sort({ createdAt: -1 }) // Sort by newest first
                .skip(skip)
                .limit(limit),
            Note.countDocuments({ user: new Types.ObjectId(userId) })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            notes,
            total,
            page,
            limit,
            totalPages
        };
    }

    /**
     * Get a specific note by ID
     */
    async getNoteById(noteId: string, userId: string): Promise<INote | null> {
        return await Note.findOne({
            _id: new Types.ObjectId(noteId),
            user: new Types.ObjectId(userId)
        });
    }

    /**
     * Update a note
     */
    async updateNote(noteId: string, userId: string, updates: Partial<INote>): Promise<INote | null> {
        return await Note.findOneAndUpdate(
            {
                _id: new Types.ObjectId(noteId),
                user: new Types.ObjectId(userId)
            },
            { $set: updates },
            { new: true }
        );
    }

    /**
     * Delete a note
     */
    async deleteNote(noteId: string, userId: string): Promise<boolean> {
        const result = await Note.deleteOne({
            _id: new Types.ObjectId(noteId),
            user: new Types.ObjectId(userId)
        });
        return result.deletedCount > 0;
    }
}