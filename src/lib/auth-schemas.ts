import * as v from "valibot";

const email = v.pipe(v.string(), v.trim(), v.email("Enter a valid email"));

export const signInSchema = v.object({
	email,
	password: v.pipe(v.string(), v.minLength(1, "Enter your password")),
});

export const signUpSchema = v.object({
	name: v.pipe(v.string(), v.trim(), v.minLength(1, "Enter your name")),
	email,
	password: v.pipe(
		v.string(),
		v.minLength(8, "Use at least 8 characters"),
		v.maxLength(128, "Use 128 characters or fewer"),
	),
});
