import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
	name: string;
	email: string;
	password: string;
	avatar: string;
	createdAt: Date;
}

interface IUserMethods {
	comparePasswords: (password: string) => Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
	name: {
		type: String,
		required: [true, 'Please provide your name.'],
		minlength: [1, 'Please provide correct name.'],
	},
	email: {
		type: String,
		required: [true, 'Please probide your email.'],
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
		required: [true, 'Please provide your password.'],
		minlength: [6, 'Password must be at least 6 characters long.'],
		select: false,
	},
	avatar: String,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

userSchema.method('comparePasswords', async function (password: string) {
	const arePasswordsSame = await bcrypt.compare(password, this.password);
	return arePasswordsSame;
});

userSchema.pre('save', async function (next) {
	if (this.isNew) {
		const hashedPassword = await bcrypt.hash(this.password, 13);
		this.password = hashedPassword;
	}

	next();
});

export default model<IUser, UserModel>('User', userSchema);
