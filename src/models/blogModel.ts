import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlog extends Document {
    banner?: {
        url: string;
        public_id: string;
    };
    title: string;
    content: string;
    owner: mongoose.Types.ObjectId;
    reaction?: number;
    readingTime?: number;
    totalBookmark?: number;
    totalVisit?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const BlogSchema: Schema<IBlog> = new mongoose.Schema({
    banner: {
        url: {
            type: String,
            required: false
        },
        public_id: {
            type: String,
            required: false
        }
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    reaction: {
        type: Number,
        default: 0
    },
    readingTime: {
        type: Number,
        default: 0
    },
    totalBookmark: {
        type: Number,
        default: 0
    },
    totalVisit: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

export const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema); 