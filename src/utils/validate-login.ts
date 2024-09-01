const validateLogin = (email: string, password: string) => {
	const errors: { field: string; error: string }[] = [];

	if (!password || password.trim().length === 0) {
		errors.push({ field: 'password', error: 'Please provide your password.' });
	}

	if (!email || email.trim().length === 0) {
		errors.push({ field: 'email', error: 'Please provide your email.' });
	} else if (!/[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/.test(email)) {
		errors.push({
			field: 'email',
			error: 'Please provide correct email address.',
		});
	}

	return errors;
};

export default validateLogin;
