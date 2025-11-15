-- Add Closed Event for After-Event Hub Testing
-- Run this in Supabase SQL Editor
-- This will add a past event that you can use to test photo sharing and feedback features

DO $$
DECLARE
  first_user_id uuid;
BEGIN
  -- Get the first user ID from auth.users
  SELECT id INTO first_user_id FROM auth.users ORDER BY created_at LIMIT 1;
  
  -- If no user exists, raise an error
  IF first_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found! Please sign up first at your app, then run this script.';
  END IF;
  
  RAISE NOTICE 'Using user ID as organizer: %', first_user_id;
  
  -- Insert the closed event
  INSERT INTO events (
    id,
    title,
    description,
    organizer_id,
    location_lat,
    location_lng,
    address,
    city,
    state,
    category,
    start_date,
    end_date,
    price,
    max_attendees,
    current_attendees,
    images,
    tags,
    is_public,
    created_at
  ) VALUES (
    '00000000-0000-0001-0000-000000000019',
    'New Year''s Eve Gala 2024 [ENDED]',
    'Ring in the new year with an unforgettable celebration! Live music, gourmet dinner, and spectacular fireworks display at midnight. Thank you to all attendees who made this night special!',
    first_user_id,
    30.7522,
    76.8073,
    'Rock Garden, Sector 1, Chandigarh 160001',
    'Chandigarh',
    'Chandigarh',
    'Music & Concerts',
    '2023-12-31 19:00:00+00'::timestamptz,
    '2024-01-01 01:00:00+00'::timestamptz,
    2500,
    500,
    478,
    ARRAY['https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'],
    ARRAY['New Year', 'Celebration', 'Music', 'Fireworks', 'Gala'],
    true,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Closed event added successfully!';
  
  -- Add the organizer as an attendee to the closed event so they can test After-Event Hub
  INSERT INTO event_attendees (event_id, user_id, status)
  VALUES (
    '00000000-0000-0001-0000-000000000019',
    first_user_id,
    'attending'
  )
  ON CONFLICT (event_id, user_id) DO NOTHING;
  
  RAISE NOTICE 'Added organizer as attendee to closed event for After-Event Hub testing';
  RAISE NOTICE 'You can now test the After-Event Hub features (photo sharing and feedback)!';
  
END $$;

-- Verify the event was added
SELECT 
  title, 
  TO_CHAR(start_date, 'Mon DD, YYYY HH24:MI') as start_time,
  TO_CHAR(end_date, 'Mon DD, YYYY HH24:MI') as end_time,
  current_attendees,
  max_attendees,
  price,
  city
FROM events 
WHERE id = '00000000-0000-0001-0000-000000000019';
