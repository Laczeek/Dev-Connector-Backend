/// <reference path="../types/index.d.ts" />
import { NextFunction, Request, Response } from 'express';
import { ClientSession, startSession } from 'mongoose';

import Profile from '../models/Profile';
import User from '../models/User';
import Post from '../models/Post';
import AppError from '../utils/AppError';
import { Error } from 'mongoose';

const getAuthUserProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const profile = await Profile.findOne({ user: req.user!._id }).populate('user', ['name', 'avatar']);

		if (!profile) throw new AppError("You don't have a profile yet.", 404);

		res.status(200).json(profile);
	} catch (err) {
		next(err);
	}
};
const createOrUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Exclude experience and education.
		if (req.body.experience || req.body.education)
			throw new AppError(
				'Updating experience or education is not allowed via this endpoint. Please use the specific endpoints for adding experience or education.',
				400
			);

		const profileData = { ...req.body };
		if (profileData.skills.trim().length === 0) throw new AppError('Please provide your skills.', 400, 'skills');

		if (profileData.user) {
			delete profileData.user;
		}
		if (profileData.createdAt) {
			delete profileData.createdAt;
		}

		let skillsArray: string[] = [];
		if (profileData.skills && typeof profileData.skills === 'string') {
			skillsArray = Profile.createSkillsArray(profileData.skills);
		}

		const profile = await Profile.findOneAndUpdate(
			{ user: req.user!._id },
			{ ...profileData, skills: skillsArray },
			{ upsert: true, new: true, runValidators: true }
		);

		res.status(200).json(profile);
	} catch (err) {
		next(err);
	}
};

const getAllProfiles = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const profiles = await Profile.find({}, 'user company status location skills').populate('user', ['avatar', 'name']);

		res.status(200).json(profiles);
	} catch (err) {
		next(err);
	}
};

const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
	const uid = req.params.uid;
	try {
		const profile = await Profile.findOne({ user: uid }).populate('user', ['name', 'avatar']);

		if (!profile) throw new AppError('Profile not found.', 404);

		res.status(200).json(profile);
	} catch (err) {
		if (err instanceof Error.CastError && err.kind === 'ObjectId') {
			err = new AppError('Profile not found.', 404);
		}
		next(err);
	}
};

const deleteProfileAndUser = async (req: Request, res: Response, next: NextFunction) => {
	let session: ClientSession = await startSession();
	session.startTransaction();
	try {
		const userId = req.user!._id;

		await Profile.findOneAndDelete({ user: userId }, { session });
		await User.findByIdAndDelete(userId, { session });
		await Post.deleteMany({ user: userId }, { session });

		await session.commitTransaction();

		res.status(204).json({ message: 'success' });
	} catch (err) {
		await session.abortTransaction();
		next(err);
	}
};

const addProfileExperience = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updatedProfile = await Profile.findOneAndUpdate(
			{ user: req.user!._id },
			{
				$push: {
					experience: {
						$each: [req.body],
						$position: 0,
					},
				},
			},
			{ runValidators: true, new: true }
		);

		res.status(200).json(updatedProfile);
	} catch (err) {
		next(err);
	}
};

const deleteProfileExperience = async (req: Request, res: Response, next: NextFunction) => {
	const eid = req.params.eid;
	try {
		const result = await Profile.updateOne({ user: req.user!._id }, { $pull: { experience: { _id: eid } } });

		if (result.modifiedCount === 0) throw new AppError('There is no experience with the given _id.', 404);

		res.status(204).json({ message: 'success' });
	} catch (err) {
		next(err);
	}
};

const addProfileEducation = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updatedProfile = await Profile.findOneAndUpdate(
			{ user: req.user!._id },
			{
				$push: {
					education: {
						$each: [req.body],
						$position: 0,
					},
				},
			},
			{
				runValidators: true,
				new: true,
			}
		);

		res.status(200).json(updatedProfile);
	} catch (err) {
		next(err);
	}
};

const deleteProfileEducation = async (req: Request, res: Response, next: NextFunction) => {
	const eid = req.params.eid;
	try {
		const result = await Profile.updateOne({ user: req.user!._id }, { $pull: { education: { _id: eid } } });

		if (result.modifiedCount === 0) throw new AppError('There is no education with the given _id.', 404);

		res.status(204).json({ message: 'success' });
	} catch (err) {
		next(err);
	}
};

const getGithubRepos = async (req: Request, res: Response, next: NextFunction) => {
	const githubName = req.params.githubName;

	const options = {
		uri: encodeURI(`https://api.github.com/users/${githubName}/repos?per_page=5&sort=created:asc`),
		method: 'GET',
		headers: {
			'user-agent': 'node.js',
			Authorization: `token ${process.env.GITHUB_TOKEN}`,
		},
	};

	try {
		const response = await fetch(
			`https://api.github.com/users/${githubName}/repos?per_page=5&client_id=${process.env.CLIENT_GITHUB}&client_secret=${process.env.SECRET_GITHUB}`,
			options
		);

		if (!response.ok) throw new AppError('No Github profile found.', 404);

		const repos = await response.json();
		res.status(200).json(repos);
	} catch (err) {
		next(err);
	}
};

export default {
	getAuthUserProfile,
	createOrUpdateProfile,
	getAllProfiles,
	getUserProfile,
	deleteProfileAndUser,
	addProfileExperience,
	deleteProfileExperience,
	addProfileEducation,
	deleteProfileEducation,
	getGithubRepos,
};
