// Render the reader page with all posts
module.exports.readerPage = async (req, res) => {
    const Post = require('../models/Post');
    const User = require('../models/userSchema');
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    let user = null;
    if (req.session && req.session.userId) {
        user = {
            _id: req.session.userId,
            username: req.session.username,
            role: req.session.role
        };
    }
    res.render('./pages/blog/reader', { posts, user });
};
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const Post = require('../models/Post')

module.exports.defaultRoute = (req, res) => {
    // Always show login page as the first page
    return res.render('./pages/auth/login', { query: req.query || {} });
}

module.exports.homePageAdmin = (req, res) => {
    if(req.session && req.session.userId){
        console.log('Session active');
        if(req.session.role == "admin"){
            return res.render('index');
        }else{
            return res.redirect('/blog');
        }
    }else{
        return res.redirect('/login');
    }
}

module.exports.homePageReader = async (req, res) => {
    if (!req.session?.userId) return res.redirect('/login');
    // allow both roles to see feed
    const allPosts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    const categories = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)));
    const category = req.query.category;
    const posts = category ? allPosts.filter(p => p.category === category) : allPosts;
    // Pass user info to EJS for navbar logic
    const user = {
        _id: req.session.userId,
        username: req.session.username,
        role: req.session.role
    };
    // Fetch all users for dropdown CRUD
    const users = await User.find({}, '-password');
    return res.render('./pages/blog/blogHome', { posts, user, categories, category, users });
};

module.exports.homePageWriter = (req, res) => {
  if (!req.session?.userId) return res.redirect('/login');
  return res.render('./pages/writer/writerHome'); // the create form
};

module.exports.login = (req, res) => {
    return res.render('./pages/auth/login', { query: req.query });
}
module.exports.loginHandle = async (req, res) => {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = user.role;
        // After login, show blog homepage
        return res.redirect('/blog');
    } else {
        return res.redirect('/?loginError=1');
    }
}
module.exports.signup = (req, res) => {
    return res.render('./pages/auth/signup')
}
module.exports.signupHandle = async (req, res) => {
    const { username, email, password ,role} = req.body;
    try {
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.redirect('/?signupError=1');
        } else {
            const hashed = await bcrypt.hash(password, 10);
            const newUser = await User.create({ username, email, password: hashed ,role });
            console.log("New User Created", newUser);
            // Auto-login after signup
            req.session.userId = newUser._id;
            req.session.username = newUser.username;
            req.session.role = newUser.role;
            return res.redirect('/blog');
        }
    } catch (error) {
        console.log(error.message);
        return res.redirect('/signup');
    }
}

module.exports.logout = (req,res)=>{
    req.session.destroy(()=>{
        return res.redirect('/login');
    })
}