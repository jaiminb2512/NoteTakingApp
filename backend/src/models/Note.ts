import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INote extends Document {
    title: string;
    content: string;
    user: Types.ObjectId;
}

const noteSchema = new Schema<INote>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export const Note = mongoose.model<INote>('Note', noteSchema);
