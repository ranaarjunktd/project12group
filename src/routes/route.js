const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController.js");
const blogController = require('../controllers/blogController.js');


router.post('/authors', authorController.createAuthor);
router.post('/createBlogs', blogController.createBlog);

// router.get('/listBlogs', blogController.listBlogs);
router.get('/getBlogs', blogController.listBlogsByQuery);
router.put('/updateBlog/:blogId', blogController.updateBlog);

router.post('/login', authorController.login);




module.exports = router;
