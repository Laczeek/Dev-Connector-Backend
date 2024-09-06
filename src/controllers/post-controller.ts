/// <reference path="../types/index.d.ts" />
import { NextFunction, Request, Response } from 'express';
import { Error, mongo } from 'mongoose';

import AppError from '../utils/AppError';
import Post from '../models/Post';
import User from '../models/User';

const createPost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { text } = req.body;

		const user = await User.findById(req.user!._id);
		if (!user) throw new AppError('User not found. Unable to create post because the user does not exist.', 404);

		const newPost = await Post.create({ text, user: user.id, avatar: user.avatar, name: user.name });
		res.status(201).json(newPost);
	} catch (err) {
		next(err);
	}
};

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const posts = await Post.find({});

		res.status(200).json(posts);
	} catch (err) {
		next(err);
	}
};

const getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
	const pid = req.params.pid;
	try {
		const post = await Post.findById(pid);
		if (!post) throw new AppError('Post not found.', 404);

		res.status(200).json(post);
	} catch (err) {
		if (err instanceof Error.CastError && err.kind === 'ObjectId') {
			err = new AppError('Post not found.', 404);
		}
		next(err);
	}
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
	const pid = req.params.pid;
	try {
		const post = await Post.findById(pid);
		if (!post) throw new AppError('Post not found.', 404);

		if (post.user.toString() !== req.user!._id) throw new AppError("You're unathorized.", 401);

		await Post.deleteOne({ _id: pid });

		res.status(204).send();
	} catch (err) {
		if (err instanceof Error.CastError && err.kind === 'ObjectId') {
			err = new AppError('Post not found.', 404);
		}
		next(err);
	}
};

const likeOrUnlikePost = async (req: Request, res: Response, next: NextFunction) => {
	const pid = req.params.pid;
	try {
		const post = await Post.findById(pid);
		if (!post) throw new AppError('Post not found.', 404);

		const userLikeIndex = post.likes.findIndex(userId => userId.toString() === req.user!._id);
		if (userLikeIndex === -1) {
			post.likes.push(new mongo.ObjectId(req.user!._id));
		} else {
			post.likes.splice(userLikeIndex, 1);
		}

		await post.save();

		res.status(200).json(post.likes);
	} catch (err) {
		next(err);
	}
};

const addCommentToPost = async (req: Request, res: Response, next: NextFunction) => {
	const pid = req.params.pid;
	try {
		const { text } = req.body;

		const user = await User.findById(req.user!._id);
		if (!user) throw new AppError('User not found. Unable to create comment because the user does not exist.', 404);

		const post = await Post.findByIdAndUpdate(
			pid,
			{
				$push: { comments: { text, user: user.id, name: user.name, avatar: user.avatar } },
			},
			{ runValidators: true, new: true }
		);

		if (!post) throw new AppError('Post not found.', 404);

		res.status(201).json(post?.comments);
	} catch (err) {
		next(err);
	}
};

const removeCommentFromPost = async (req: Request, res: Response, next: NextFunction) => {
	const { pid, cid } = req.params;
    console.log(cid);
	try {
		const post = await Post.findOneAndUpdate(
			{ _id: pid, comments: { $elemMatch: { _id: cid, user: req.user!._id } } },
			{ $pull: { comments: { _id: cid } } }
		);
		
		if (!post) throw new AppError('Comment not found.', 404);

		res.status(204).send();
	} catch (err) {
		next(err);
	}
};

export default {
	createPost,
	getAllPosts,
	getSinglePost,
	deletePost,
	likeOrUnlikePost,
	addCommentToPost,
	removeCommentFromPost,
};
