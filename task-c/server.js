require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json());

const posts = [
  {
    username: 'Kyle',
    title: 'First post',
    id: 123
  },
  {
    username: 'Nicholas',
    title: 'Second post',
    id: 456
  }
]

const users = [
    {
        username: 'Kyle',
        role: 'admin'
    },
    {
        username: 'Nicholas',
        role: 'user'
    }
]


// authenticated users can access this route and see their own posts, admins can see all posts
app.get('/posts', authenticateToken, (req, res) => {
    // get user from users array where username matches req.user.username
    const currUser = users.find(u => u.username === req.user.name);
    console.log(req.user.name);
    if (currUser.role === 'admin') {
        res.json(posts);
    } else {
        res.json(posts.filter(post => post.username === req.user.name));
    }
});

// admins can delete all posts, users can only delete posts they created
app.delete('/posts/:id', authenticateToken, (req, res) => {
    const currUser = users.find(user => user.username === req.user.name);
    if (currUser.role === 'admin') {
        posts.splice(posts.findIndex(post => post.id === req.params.id), 1); // remove post from posts array
        res.json({ message: 'Post deleted' });
    } else {
        // find post in posts array where id matches req.params.id
        const post = posts.find(p => p.id === parseInt(req.params.id));
        if (post && post.username === req.user.name) {
            posts.splice(posts.findIndex(p => p.id === parseInt(req.params.id)), 1); // remove post from posts array
            res.json({ message: 'Post deleted' });
        } else if (post) {
            res.status(401).json({ message: 'You do not have permission to delete this post' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    }
});



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // no token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // token no longer valid
        req.user = user;
        next(); // move on from middleware
    });
}

app.listen(3000);