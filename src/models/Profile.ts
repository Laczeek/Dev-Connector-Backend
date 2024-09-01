import { Schema, Types, model } from 'mongoose';

interface IProfile {
	user: Types.ObjectId;
	company: string;
	website: string;
	location: string;
	status: string;
	skills: string[];
	bio: string;
	githubusername: string;
	experience: { title: string; company: string; location: string; from: string; to: Date; current: boolean }[];
	education: {
		school: string;
		degree: string;
		fieldofstudy: string;
		from: Date;
		to: Date;
		current: boolean;
		description: string;
	}[];
	social: { youtube: string; twitter: string; facebook: string; linkedin: string; instagram: string };
	createdAt: Date;
}

const profileSchema = new Schema<IProfile>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	company: String,
	website: String,
	location: String,
	status: {
		type: String,
		required: true,
	},
	skills: {
		type: [String],
		required: true,
	},
	bio: String,
	githubusername: String,
	experience: [
		{
			title: {
				type: String,
				required: true,
			},
			company: {
				type: String,
				required: true,
			},
			location: String,
			from: {
				type: Date,
				required: true,
			},
			to: Date,
			current: {
				type: Boolean,
				default: false,
			},
			description: String,
		},
	],
	education: [
		{
			school: {
				type: String,
				required: true,
			},
			degree: {
				type: String,
				required: true,
			},
			fieldofstudy: {
				type: String,
				required: true,
			},
			from: {
				type: Date,
				required: true,
			},
			to: Date,
			current: {
				type: Boolean,
				default: false,
			},
			description: String,
		},
	],
	social: {
		youtube: String,
		twitter: String,
		facebook: String,
		linkedin: String,
		instagram: String,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

export default model<IProfile>('Profile', profileSchema);
