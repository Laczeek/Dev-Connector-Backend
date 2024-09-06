import { Schema, model, Types } from 'mongoose';

interface IComment {
	user: Types.ObjectId;
	name: string;
	avatar: string;
	text: string;
	createdAt: Date;
}

interface IPost {
	user: Types.ObjectId;
	text: string;
	name: string;
	avatar: string;
	likes: Types.ObjectId[];
	comments: IComment[];
	createdAt: Date;
}

const postSchema = new Schema<IPost>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	text: {
		type: String,
		required: [true, 'Please provide the text of your post.'],
		minlength: [6, 'Text must be at least 6 characters long.'],
		maxlength: [500, 'The text must be no more than 500 characters long.'],
	},
	name: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
		required: true,
	},
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			avatar: {
				type: String,
				required: true,
			},
			text: {
				type: String,
				required: [true, 'Please provide the text of your comment.'],
				minlength: [6, 'Comment text must be at least 6 characters long.'],
				maxlength: [300, 'The comment text must be no more than 300 characters long.'],
			},
			createdAt: {
				type: Date,
				default: Date.now(),
			},
		},
	],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

export default model<IPost>('Post', postSchema);
