const Comment = require('../models/commentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const checkPermission = async (loggedInUserId, commentId, method, next) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  const commentCreatorId = comment.user.id;
  const blogAuthorId = comment.blog.author.id;

  let permissionGranted = undefined;
  if (method === 'PATCH') {
    if (loggedInUserId === commentCreatorId) permissionGranted = commentId;
  } else if (method === 'DELETE') {
    if (loggedInUserId === commentCreatorId || loggedInUserId === blogAuthorId)
      permissionGranted = commentId;
  }

  return permissionGranted;
};

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.blog) req.body.blog = req.params.blogId;

  const comment = await Comment.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const commentId = await checkPermission(
    req.user.id,
    req.params.id,
    'PATCH',
    next
  );

  if (!commentId) {
    return next(
      new AppError('You do not have permission to perform this action', 401)
    );
  }

  const newComment = await Comment.findByIdAndUpdate(commentId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      comment: newComment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const commentId = await checkPermission(
    req.user.id,
    req.params.id,
    'DELETE',
    next
  );

  if (!commentId) {
    return next(
      new AppError('You do not have permission to perform this action', 401)
    );
  }

  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
