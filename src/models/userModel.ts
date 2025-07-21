import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    profilePhoto?: {
        url?: string;
        public_id?: string;
    };
    name: string;
    username: string;
    bio?: string;
    email: string;
    password: string;
    blogs?: mongoose.Types.ObjectId[];
    blogPublished?: number;
    reactedBlogs?: mongoose.Types.ObjectId[];
    totalVisits?: number;
    totalReactions?: number;
    readingList?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    profilePhoto: {
        url: String,
        public_id: String
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    bio: String,
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    blogs: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Blog'
    }],
    blogPublished: {
        type: Number,
        default: 0
    },
    reactedBlogs: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Blog'
    }],
    totalVisits: {
        type: Number,
        default: 0
    },
    totalReactions: {
        type: Number,
        default: 0
    },
    readingList: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Blog'
    }]
}, {
    timestamps: true
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 