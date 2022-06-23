const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController.js");
const blogController = require('../controllers/blogController.js');
const middleware = require('../middlewares/routeBasedMiddleware.js');

//new author registration
router.post('/createAuthors',authorController.createAuthor);
//login
router.post('/authorLogin', authorController.login);
//create blogs, view blogs
router.post('/createBlogs', middleware.checkLogin, blogController.createBlog);
router.get('/getBlogs', middleware.checkLogin, blogController.listBlogsByQuery);
//edit blogs, delete blogs
router.put('/updateBlog/:blogId', middleware.checkLogin, middleware.checkOwner, blogController.updateBlog);
router.delete('/blogs/:blogId', middleware.checkLogin, middleware.checkOwner, blogController.deleteById );
router.delete('/blogs/deleteByQuery', middleware.checkLogin, blogController.deleteByQuery);//incomplete


router.delete('/deleteTest/query', middleware.checkLogin, blogController.deleteByQuery);





module.exports = router;
