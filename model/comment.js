import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    commentedBy: {
        type: String,
        required: true
    },
    blogId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

export default mongoose.model("Comment", commentSchema)