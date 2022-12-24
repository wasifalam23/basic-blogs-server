const express = require('express');
const commentRoutes = require('../routes/commentRoutes');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use('/:blogId/comments', commentRoutes);

router
  .route('/')
  .get(blogController.getAllBlog)
  .post(
    authController.protect,
    blogController.uploadBlogImage,
    blogController.resizeBlogImage,
    blogController.createBlog
  );

router.get('/getMyBlogs', authController.protect, blogController.getMyBlogs);

router
  .route('/:id')
  .get(blogController.getBlogById)
  .patch(
    authController.protect,
    blogController.uploadBlogImage,
    blogController.resizeBlogImage,
    blogController.updateBlog
  )
  .delete(authController.protect, blogController.deleteBlog);

module.exports = router;
