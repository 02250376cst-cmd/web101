'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function SignupPage() {
const [isLoading, setIsLoading] = useState(false);

const {
register,
handleSubmit,
watch,
formState: { errors }
} = useForm();

const password = watch('password');

const onSubmit = async (data) => {
setIsLoading(true);

```
console.log('Signup data:', data);

// Simulate API request
setTimeout(() => {
  setIsLoading(false);
  alert('Registration successful (demo)');
}, 1500);
```

};

return ( <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12"> <div className="max-w-md w-full space-y-8">

```
    {/* Header */}
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-gray-900">
        Sign up for TikTok
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Create a profile, follow accounts, and share your own videos.
      </p>
    </div>

    {/* Form */}
    <form
      className="space-y-5"
      onSubmit={handleSubmit(onSubmit)}
    >

      {/* Username */}
      <div>
        <input
          type="text"
          placeholder="Username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters'
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Only letters, numbers and underscores allowed'
            }
          })}
        />

        {errors.username && (
          <p className="text-red-500 text-xs mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email address"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address'
            }
          })}
        />

        {errors.email && (
          <p className="text-red-500 text-xs mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
              message:
                'Must include uppercase, lowercase, number and symbol'
            }
          })}
        />

        {errors.password && (
          <p className="text-red-500 text-xs mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'Passwords do not match'
          })}
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-center text-sm">
        <input
          type="checkbox"
          className="mr-2"
          {...register('terms', {
            required: 'You must agree to the terms'
          })}
        />

        <span>
          I agree to the{' '}
          <a className="text-red-600 hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a className="text-red-600 hover:underline">
            Privacy Policy
          </a>
        </span>
      </div>

      {errors.terms && (
        <p className="text-red-500 text-xs">
          {errors.terms.message}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        {isLoading ? 'Creating account...' : 'Sign up'}
      </button>

    </form>

    {/* Login Link */}
    <div className="text-center text-sm">
      Already have an account?{' '}
      <Link
        href="/login"
        className="text-red-600 hover:underline"
      >
        Log in
      </Link>
    </div>

  </div>
</div>


);
}
