import { Schema, model } from 'mongoose';

interface IUser {
	name: string;
	email: string;
	password: string;
	avatar: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
			minlength: [1, 'Please provide correct name.'],
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
            unique: true,
			validate: {
				validator: (val: string) => {
					return /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/.test(val);
				},
				message: 'Please provide correct email address.',
			},
		},
		password: {
			type: String,
			required: true,
			minlength: [6, 'Password must be at least 6 characters long.'],
		},
		avatar: String,
        createdAt: {
            type: Date,
            default: Date.now()
        }
	},

);

export default model<IUser>('User', userSchema)