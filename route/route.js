import express from "express";
import multer from "multer";
import { checkUserExistence, CreateUser, validate, createBlog, getAllBlog, getUserBlog, showBlog, showBlogForUpdate, updateBlog, createComment, showComment, handleLike, incrementViews, checkTitle, profile, delUser } from "../controller/api.js";

const route = express.Router();

const upload = multer({ storage: multer.memoryStorage()});

route.post("/checkUserExistence", checkUserExistence);
route.post("/create", CreateUser);
route.post("/validate", validate);
route.post("/createBlog", upload.single("image"), createBlog);
route.get("/getAllBlog", getAllBlog);
route.get("/getUserBlog", getUserBlog);
route.get(`/showBlog/:id`, showBlog);
route.get(`/showBlogForUpdate/:id`, showBlogForUpdate);
route.put(`/updateBlog/:id`, upload.single("image"), updateBlog);
route.post("/createComment", createComment);
route.get(`/getComment/:blogId`,showComment)
route.post("/handleLike", handleLike);
route.post(`/incrementViews/:id`, incrementViews);
route.get(`/checkTitle/:title`, checkTitle);
route.get(`/profile/:_id`, profile);
route.delete(`/delUser/:id`, delUser);


export default route;
