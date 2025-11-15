# Create Event Debugging Guide

## Changes Made

### 1. **Added Geocoding Functionality**

The system now automatically converts address, city, and state into latitude/longitude coordinates for map pin placement.

**How it works:**

- Uses Nominatim (OpenStreetMap) free geocoding API
- When you enter an address like "Rock Garden, Sector 1" + "Chandigarh" + "Chandigarh", it finds the exact coordinates
- These coordinates are used to place the pin on the map

### 2. **Fixed User Authentication**

- Now uses actual logged-in user data from `useAuthStore` instead of hardcoded "current-user"
- Validates that user is logged in before creating event
- Uses real user name, ID, and avatar

### 3. **Added Comprehensive Error Handling**

- Validates all required fields
- Shows specific error messages
- Displays errors in the UI with a red alert box
- Console logs for debugging

### 4. **Added Loading States**

- Button shows "Creating..." when submitting
- Form is disabled during submission
- Prevents duplicate submissions

## How to Test

### Step 1: Make Sure You're Logged In

1. Go to landing page and sign up (if you haven't)
2. Or login if you already have an account
3. Check browser console: `console.log` will show your user data

### Step 2: Open Browser Console

Press F12 (or Cmd+Option+I on Mac) to see debug logs

### Step 3: Create an Event

1. Click "Create Event" button on the main page
2. Fill in the form:
   - **Title**: "Test Event"
   - **Description**: "Testing event creation"
   - **Category**: Select any category
   - **Address**: "Rock Garden, Sector 1"
   - **City**: "Chandigarh"
   - **State**: "Chandigarh"
   - **Start Date**: Pick a date
   - **Price**: 0 (for free)

3. Click "Create Event" button

### Step 4: Check Console Logs

You should see these logs in order:

```
Starting event creation...
User: {id: "...", name: "...", email: "..."}
Form data: {title: "Test Event", ...}
Geocoding address: Rock Garden, Sector 1, Chandigarh, Chandigarh, India
Geocoding response: [{lat: "30.7522", lon: "76.8073", ...}]
Coordinates found: {lat: 30.7522, lng: 76.8073}
Creating event with data: {...}
Event created successfully: {id: "...", title: "Test Event", ...}
```

### Step 5: Verify in Supabase

1. Go to Supabase Dashboard
2. Open "Table Editor"
3. Select "events" table
4. You should see your new event!

## Common Issues & Solutions

### Issue 1: "You must be logged in to create an event"

**Cause**: User is not authenticated
**Solution**:

- Go to landing page and sign up/login
- Check if `localStorage` has a session token
- Run in console: `localStorage.getItem('sb-...-auth-token')`

### Issue 2: "Could not find location coordinates"

**Cause**: Geocoding failed or address is invalid
**Solutions**:

- Make sure address is detailed enough (e.g., "Rock Garden, Sector 1")
- Include proper city and state names
- Check if internet connection is working
- Try a well-known landmark first

**Fallback**: If geocoding continues to fail, you can temporarily set manual coordinates:

- Chandigarh city center: `30.7333, 76.7794`
- Rock Garden: `30.7522, 76.8073`
- Sukhna Lake: `30.7423, 76.8186`

### Issue 3: Database Error (23503 foreign key violation)

**Cause**: User's profile doesn't exist in the `profiles` table
**Solution**:

1. Check Supabase → Authentication → Users
2. Copy your user ID
3. Go to SQL Editor and run:

```sql
INSERT INTO profiles (id, email, name, username)
VALUES ('YOUR_USER_ID', 'your@email.com', 'Your Name', 'username')
ON CONFLICT (id) DO NOTHING;
```

### Issue 4: Event creates but doesn't show on map

**Cause**: Frontend isn't refreshing or fetching events after creation
**Solution**: Refresh the page or call `fetchEvents()` after creation

## Testing Checklist

- [ ] User is logged in (check auth store)
- [ ] Form validation works (try submitting empty form)
- [ ] Geocoding works (check console for coordinates)
- [ ] Event saves to Supabase database
- [ ] Event appears in events list
- [ ] Event shows on map with correct pin location
- [ ] Error messages display properly
- [ ] Loading state works (button shows "Creating...")

## Next Steps

If everything works:

1. Test with different addresses
2. Test with different categories
3. Try adding tags and requirements
4. Test max attendees limit
5. Test paid vs free events

If issues persist:

1. Share the console logs
2. Check Supabase logs (Logs & Reports tab)
3. Verify database schema is correct
4. Check RLS policies allow INSERT for authenticated users

## Quick Database Check Query

Run this in Supabase SQL Editor to verify everything:

```sql
-- Check if your user exists
SELECT * FROM auth.users LIMIT 5;

-- Check if profile exists
SELECT * FROM profiles LIMIT 5;

-- Check if events table is accessible
SELECT * FROM events ORDER BY created_at DESC LIMIT 5;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'events';
```
