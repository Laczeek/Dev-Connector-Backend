import { Model, Schema, Types, model } from 'mongoose';

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

interface ProfileModel extends Model<IProfile> {
	createSkillsArray(skills: string): string[];
}

const profileSchema = new Schema<IProfile, ProfileModel>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		unique: true,
	},
	company: String,
	website: String,
	location: String,
	status: {
		type: String,
		required: [true, 'Please provide your status.'],
	},
	skills: {
		type: [String],
		required: true,
		validate: {
			validator: (val: string[]) => {
				return val.length > 0;
			},
			message: 'Please provide your skills.',
		},
	},
	bio: String,
	githubusername: String,
	experience: [
		{
			title: {
				type: String,
				required: [true, 'Please provide the title of your experience.'],
			},
			company: {
				type: String,
				required: [true, 'Please provide the name of the company you worked for.'],
			},
			location: String,
			from: {
				type: Date,
				required: [true, 'Please provide a start date.'],
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
				required: [true, 'Please provide the name of the school where you gained experience.'],
			},
			degree: {
				type: String,
				required: [true, 'Please provide a graduation rating.'],
			},
			fieldofstudy: {
				type: String,
				required: [true, 'Please specify your field of study.'],
			},
			from: {
				type: Date,
				required: [true, 'Please indicate the start date of your school.'],
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

profileSchema.static('createSkillsArray', function (skills: string) {
	return skills.split(/,\s*/);
});
export default model<IProfile, ProfileModel>('Profile', profileSchema);
