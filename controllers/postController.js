const Post = require('../models/Post');

exports.feed = async (req, res) => {
  const filter = {};
  const category = req.query.category;
  if (category) filter.category = category;
  const posts = await Post.find(filter)
    .populate('author', 'username')
    .sort({ createdAt: -1 });
  const allPosts = await Post.find();
  const categories = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)));
  res.render('./pages/blog/blogHome', { posts, categories, category });
};

exports.createForm = (req, res) => {
  res.render('./pages/writer/writerHome'); 
};

exports.create = async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const post = new Post({
      title,
      body,
      category,
      author: req.session.userId
    });
    if (req.file) {
      post.coverUrl = req.file.path;        
      post.coverPublicId = req.file.filename; 
    }
    await post.save();
    res.redirect('/blog');
  } catch (e) {
    console.log(e);
    res.status(500).send('Error creating post');
  }
};

exports.show = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.redirect('/blog'); 
    }
    const post = await Post.findById(id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    if (!post) {
      return res.redirect('/blog'); 
    }
    res.render('./pages/blog/post', { post, me: req.session.userId });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Server Error');
  }
};

exports.toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.redirect('/blog');
  const uid = req.session.userId.toString();
  const i = post.likes.findIndex(x => x.toString() === uid);
  if (i >= 0) post.likes.splice(i, 1);
  else post.likes.push(uid);
  await post.save();
  res.redirect('/posts/' + post._id);
};


exports.addComment = async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.redirect('/posts/' + req.params.id);
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: { author: req.session.userId, body } }
  });
  res.redirect('/posts/' + req.params.id);
};

// Show edit form
exports.editForm = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.redirect('/blog');
  res.render('./pages/writer/editPost', { post });
};

// Update post
exports.update = async (req, res) => {
  try {
  const { title, body, category } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.redirect('/blog');
  post.title = title;
  post.body = body;
  post.category = category;
  if (req.file) {
    post.coverUrl = req.file.path;
    post.coverPublicId = req.file.filename;
  }
  await post.save();
  res.redirect('/posts/' + post._id);
  } catch (e) {
    console.log(e);
    res.status(500).send('Error updating post');
  }
};

// Delete post
exports.delete = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.redirect('/blog');
    await post.deleteOne();
    res.redirect('/blog');
  } catch (e) {
    console.log(e);
    res.status(500).send('Error deleting post');
  }
};
