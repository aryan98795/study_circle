const { blogModel } = require("../models/blogs");
const { userModel } = require("../models/users");


module.exports.createPost = async function (req, res) {
  const { title, content, imageURL, tags } = req.body;

  // Ensure tags is an array as per the schema
  const tagsArray = Array.isArray(tags) ? tags : [tags];

  const newBlog = await blogModel.create({
    title,
    content,
    images: [imageURL],
    tags: tagsArray,
    author: req.user.user._id,
  });

  // Add the blog ID to the user's blogs field
  await userModel.findByIdAndUpdate(req.user.user._id, { $addToSet: { blogs: newBlog._id } });

  res.status(201).json(newBlog);
};
module.exports.getPost = async (req, res) => {
  try {
    const blogs = await blogModel.find().populate("author");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error });
  }
};

module.exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await blogModel.findById(id).populate("author");
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json(blog); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch blog", error });
    }
}

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, image } = req.body;

    try {
        const blog = await blogModel.findByIdAndUpdate(
            id,
            { title, content, image },
            { new: true }
        );
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ message: "Failed to update blog", error });
    }
}
module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await blogModel.findByIdAndDelete(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        // User के blogs फील्ड से डिलीट किए गए ब्लॉग की आईडी को हटाना
        await userModel.findByIdAndUpdate(blog.author, { $pull: { blogs: id } });
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete blog", error });
    }
}