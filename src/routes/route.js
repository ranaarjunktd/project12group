const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController.js");
const blogController = require('../controllers/blogController.js');
const middleware = require('../middlewares/routeBasedMiddleware.js');
const validator = require('../validator/validator.js')

//new author registration
router.post('/createAuthors', validator.validateAuthor, authorController.createAuthor);
//login
router.post('/authorLogin', authorController.login);
//create blogs, view blogs
router.post('/createBlogs', middleware.checkLogin, validator.validateBlog, blogController.createBlog);
router.get('/getBlogs', middleware.checkLogin, blogController.listBlogsByQuery);
//edit blogs, delete blogs
router.put('/updateBlog/:blogId', middleware.checkLogin, middleware.checkOwner, validator.validateToUpdate, blogController.updateBlog);
router.delete('/blogs/:blogId', middleware.checkLogin, middleware.checkOwner, blogController.deleteById);
router.delete('/deleteBlogs/query', middleware.checkLogin, middleware.authForQueryDelete, blogController.deleteByQuery);


 


module.exports = router;
