import USER from "../model/signup.js";
import Blogs from "../model/blogs.js";
import Comment from "../model/comment.js";

export let checkUserExistence = async (req, res) => {
    try {
        const { username, email } = req.body;

        // Check if email or username exists
        const emailExist = await USER.findOne({ email });
        const usernameExist = await USER.findOne({ username });

        if (emailExist && usernameExist) {
            return res.status(200).json({ msg: "Email and username already exist." });
        } else if (emailExist) {
            return res.status(200).json({ msg: "Email already exists." });
        } else if (usernameExist) {
            return res.status(200).json({ msg: "Username already exists." });
        } else {
            return res.status(201).json({ msg: "Email and username are available." });
        }

    } catch (error) {
        return res.status(500).json(error);
    }
}

export let CreateUser = async (req, res) => {
    try {
        const data = await USER(req.body);
        if (!data) {
            return res.status(404).json({ msg: "Data not found" })
        }
        const saveData = await data.save();
        return res.status(200).json(saveData)

    } catch (error) {
        return res.status(500).json(error);
    }
}

export let validate = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }
        const user_email = await USER.findOne({ email });
        const user_password = await USER.findOne({ password });

        if (!user_email || !user_password) {
            return res.status(201).json({ status: 201, msg: "User not found" });
        } else {
            return res.status(200).json({
                status: 200, msg: "User is found", _id: user_email._id, username: user_email.username, // Return the username
                email: user_email.email
            });
        }

    } catch (error) {
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};


export let createBlog = async (req, res) => {
    try {
        const { title, description, image, email, author } = req.body;

        if (!title || !description || !image || !email || !author) {
            return res.status(400).json({ msg: "Title, description, image, email and author are required" });
        }

        const newBlog = new Blogs({ title, description, image, email, author });

        const savedBlog = await newBlog.save();
        return res.status(201).json({ status: 201, msg: "Blog created successfully", data: savedBlog });
    } catch (error) {
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};

export let getAllBlog = async (req, res) => {
    try {

        let data = await Blogs.find();
        if (!data) {
            return res.status(300).json({ msg: "data not found" });
        }
        if (data || Array.isArray(data)) {
            return res.status(200).json(data)
        }

    } catch (error) {
        return res.status(400).json(error)
    }
}

export let getUserBlog = async (req, res) => {
    try {
        const { email } = req.query;

        let data = await Blogs.find({ email });
        if (!data) {
            return res.status(300).json({ msg: "data not found" });
        }
        return res.status(200).json(data)

    } catch (error) {
        return res.status(400).json(error)
    }
}

export const showBlog = async (req, res) => {
    try {
        let id = req.params.id

        let data = await Blogs.findById(id);
        if (!data) {
            return res.status(300).json({ msg: "data not found" });
        }
        if (data || Array.isArray(data)) {
            return res.status(200).json([data])
        }
    } catch (error) {
        return res.status(400).json(error);
    }
}
export const showBlogForUpdate = async (req, res) => {
    try {
        let id = req.params.id

        let data = await Blogs.findById(id);
        if (!data) {
            return res.status(300).json({ msg: "data not found" });
        }
        return res.status(200).json(data)

    } catch (error) {
        return res.status(400).json(error);
    }
}

export const updateBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const update = { ...req.body };

        // If there's a file uploaded, encode it in Base64
        if (req.file) {
            const fileBuffer = req.file.buffer; // Get the uploaded file's buffer
            const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString("base64")}`;
            update.image = base64Image;
        }

        const data = await Blogs.findByIdAndUpdate(id, update, { new: true });
        if (!data) {
            return res.status(404).json({ msg: "Data not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: "Update failed", error });
    }
};

export let createComment = async (req, res) => {
    try {
        const data = await Comment(req.body);
        if (!data) {
            return res.status(404).json({ msg: "Data not found" })
        }
        const saveData = await data.save();
        return res.status(200).json(saveData)

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const showComment = async (req, res) => {
    try {
        let blogId = req.params.blogId
        
        let data = await Comment.find({ blogId });
        if (!data) {
            return res.status(400).json({ msg: "data not found" });
        }
        return res.status(200).json(data)
        
    } catch (error) {
        return res.status(500).json(error);
    }
}


export const handleLike = async (req, res) => {
    try {
        const { blogId, userId } = req.body;
        
        // Validate input
        if (!blogId || !userId) {
            return res.status(400).json({ msg: "Blog ID and User ID are required." });
        }

        // Find the blog document by ID
        const blog = await Blogs.findById(blogId);

        if (!blog) {
            return res.status(404).json({ msg: "Blog not found." });
        }

        // Check if the user has already liked the blog
        const userIndex = blog.likedBy.indexOf(userId);

        if (userIndex === -1) {
            // User hasn't liked the blog; add them to likedBy and increment likes
            blog.likedBy.push(userId);
            blog.likes = (blog.likes || 0) + 1;
        } else {
            // User already liked the blog; remove them from likedBy and decrement likes
            blog.likedBy.splice(userIndex, 1);
            blog.likes = Math.max((blog.likes || 1) - 1, 0); // Prevent negative likes
        }
        
        // Save the updated blog document
        await blog.save();

        return res.status(200).json({
            blogId: blog._id,
            likes: blog.likes,
            likedBy: blog.likedBy,
        });
    } catch (error) {
        // console.error("Error toggling like:", error);
        return res.status(500).json({ msg: "An error occurred.", error });
    }
};


export const incrementViews = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Assuming you use MongoDB
        const blog = await Blogs.findById(id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        blog.views = (blog.views || 0) + 1;
        await blog.save();
        
        res.status(200).json({ message: 'Views incremented', views: blog.views });
    } catch (error) {
        console.error("Error incrementing views:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const checkTitle = async (req, res) => {
    try {
        // const data =  req.body;
        let title = req.params.title;
        let data = await Blogs.find({ title: { $regex: title, $options: 'i' } });
        if (!data) {
            return res.status(400).json(data);
        }
        return res.status(200).json(data)
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const profile = async (req, res) =>{
    try {
        let _id = req.params._id;

        let data = await USER.findOne({ _id });
        if (!data) {
            return res.status(400).json({ msg: "Data not found" });
        }
        return res.status(200).json([data])
    } catch (error) {
        return res.status(500).json(error);
        
    }
}
export let delUser = async (req,res) =>{
    try {
        let id = req.params.id;
        let data = await USER.findByIdAndDelete( id );

        if(!id){
            return res.status(400).json({msg: "Data not found"})
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
}
