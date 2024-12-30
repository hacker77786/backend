import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: String, // Store as a string
        default: () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            return `${day}/${month}/${year}`;
        }
    },
    email: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
      },
      likedBy: [{
        type: String
      }],
      views: {
        type: Number,
        default: 0
      },
});

export default mongoose.model("Blogs", blogSchema);