# Landing Page Integration Guide

## Overview

The landing page is now integrated with the main EventHive application. Users can sign up or sign in from the landing page and will be automatically redirected to the main app.

## How It Works

### 1. Landing Page Location

- Original: `/landing_page/` directory
- Accessible via:
  - Direct file: `/landing_page/index.html`
  - Public folder copy: `/public/landing_page/index.html`

### 2. Authentication Flow

#### Sign Up Flow:

1. User clicks "Sign Up Free" button on landing page
2. User fills out the sign-up form (First Name, Last Name, Email, Password)
3. Upon successful signup:
   - User data is stored in `localStorage` as `eventhive_user`
   - Success message is shown
   - User is automatically redirected to the main app (`/`) after 1 second

#### Sign In Flow:

1. User clicks "Sign In" button on landing page
2. User enters email and password
3. Upon successful signin:
   - User credentials are stored in `localStorage` as `eventhive_user`
   - Success message is shown
   - User is automatically redirected to the main app (`/`) after 1 second

### 3. Main App Authentication

When the main app loads (`/`):

1. The `checkAuth()` function in `auth-store.ts` runs automatically
2. It checks for `eventhive_user` in `localStorage`
3. If found with `isAuthenticated: true`, the user is automatically logged in
4. User information is loaded into the app state
5. The app shows the authenticated user interface

## Files Modified

### 1. `/landing_page/script.js`

- Updated `handleSignUp()` function to redirect to `/` after successful signup
- Updated `handleSignIn()` function to redirect to `/` after successful signin
- Both functions now set `isAuthenticated: true` in localStorage

### 2. `/src/stores/auth-store.ts`

- Updated `checkAuth()` function to check for landing page user data
- Creates a user session from landing page credentials
- Automatically authenticates users coming from the landing page

### 3. `/next.config.js`

- Added rewrites to serve landing page at `/landing` route (optional)
- Configured to serve static landing page files

### 4. `/public/landing_page/`

- Copy of landing page files for Next.js public serving

## Testing the Integration

### Option 1: Direct HTML File

1. Open `/landing_page/index.html` in your browser
2. Click "Sign Up Free" or "Sign In"
3. Fill out the form
4. You'll be redirected to `http://localhost:3000/` (or your dev server URL)

### Option 2: Via Next.js Public Folder

1. Make sure your Next.js dev server is running: `npm run dev`
2. Navigate to `http://localhost:3000/landing_page/index.html`
3. Use the signup/signin flow
4. You'll be redirected to the main app at `/`

## Updating the Landing Page Path

If you want to change where the redirect goes, update these locations in `/landing_page/script.js`:

```javascript
// In handleSignUp function (around line 437):
window.location.href = "/"; // Change "/" to your desired path

// In handleSignIn function (around line 367):
window.location.href = "/"; // Change "/" to your desired path
```

## Production Considerations

For production deployment:

1. **Remove Mock Authentication**: Replace the setTimeout simulations in `script.js` with actual API calls
2. **Secure Storage**: Don't store passwords in localStorage (currently only simulated)
3. **Token Management**: Implement proper JWT tokens instead of mock tokens
4. **API Integration**: Connect to your backend authentication API
5. **HTTPS**: Ensure all auth flows happen over HTTPS

## LocalStorage Data Structure

The landing page stores user data in this format:

```javascript
{
  email: "user@example.com",
  name: "First Last",
  loginTime: 1234567890,
  isAuthenticated: true,
  rememberMe: true // Only for signin
}
```

## Troubleshooting

### User Not Redirecting

- Check browser console for JavaScript errors
- Verify the redirect URL is correct
- Clear localStorage and try again

### User Not Authenticated in Main App

- Check that `eventhive_user` exists in localStorage
- Verify `isAuthenticated` is set to `true`
- Check browser console for errors in the auth store

### Landing Page Not Loading

- Ensure landing page files exist in both locations
- Check Next.js server is running
- Verify file paths are correct

## Future Enhancements

1. Add proper backend API integration
2. Implement OAuth (Google, Facebook) authentication
3. Add email verification flow
4. Implement password reset functionality
5. Add session expiry and refresh tokens
6. Implement proper security measures (CSRF, XSS protection)
