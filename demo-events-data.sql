-- Demo Events Data for EventHive
-- Run this in Supabase SQL Editor after running supabase-schema.sql
-- This will populate your database with sample events

-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user ID
-- To get your user ID:
-- 1. Sign up/login to your app
-- 2. Run this query in Supabase SQL Editor: SELECT id FROM auth.users LIMIT 1;
-- 3. Copy the UUID and replace it below

-- Or use this helper to get the first user automatically:
DO $$
DECLARE
  first_user_id uuid;
BEGIN
  -- Get the first user ID from auth.users
  SELECT id INTO first_user_id FROM auth.users ORDER BY created_at LIMIT 1;
  
  -- If no user exists, raise an error
  IF first_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please sign up first, then run this script.';
  END IF;
  
  -- Update the user's profile with organizer info
  UPDATE profiles 
  SET 
    name = COALESCE(name, 'Event Organizer'),
    username = COALESCE(username, 'organizer_' || SUBSTRING(first_user_id::text, 1, 8)),
    is_verified = true
  WHERE id = first_user_id;
  
  RAISE NOTICE 'Using user ID: %', first_user_id;
END $$;

-- Insert demo events using the first user as organizer
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
) 
SELECT 
  id::uuid,
  title,
  description,
  (SELECT id FROM auth.users ORDER BY created_at LIMIT 1) as organizer_id,
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
FROM (VALUES 

-- Event 1: Rock Garden Evening Concert
(
  '00000000-0000-0001-0000-000000000001',
  'Rock Garden Evening Concert',
  'Experience an enchanting evening of classical music at the iconic Rock Garden. Local artists will perform traditional and contemporary pieces in this unique setting.',
  30.7522,
  76.8073,
  'Rock Garden, Sector 1, Chandigarh 160001',
  'Chandigarh',
  'Chandigarh',
  'Music & Concerts',
  '2025-01-15 18:00:00+00'::timestamptz,
  '2025-01-15 21:00:00+00'::timestamptz,
  500,
  300,
  156,
  ARRAY['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'],
  ARRAY['Music', 'Concert', 'Classical', 'Rock Garden'],
  true,
  NOW()
),

-- Event 2: Sukhna Lake Marathon 2024
(
  '00000000-0000-0001-0000-000000000002',
  'Sukhna Lake Marathon 2025',
  'Join hundreds of runners for the annual Sukhna Lake Marathon! Choose from 5K, 10K, or half-marathon distances around the beautiful lake.',
  
  30.7423,
  76.8186,
  'Sukhna Lake, Sector 1, Chandigarh 160001',
  'Chandigarh',
  'Chandigarh',
  'Sports & Fitness',
  '2025-02-10 06:00:00+00',
  '2025-02-10 11:00:00+00',
  800,
  500,
  387,
  ARRAY['https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=800', 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800'],
  ARRAY['Running', 'Marathon', 'Sports', 'Fitness'],
  true,
  NOW()
),

-- Event 3: Sector 17 Food Festival
(
  '00000000-0000-0001-0000-000000000003',
  'Sector 17 Food Festival',
  'A weekend celebration of Punjab''s finest cuisine! Sample dishes from 50+ food stalls featuring local favorites and international cuisine.',
  
  30.741,
  76.787,
  'Sector 17 Plaza, Chandigarh 160017',
  'Chandigarh',
  'Chandigarh',
  'Food & Drink',
  '2025-01-20 11:00:00+00',
  '2025-01-21 22:00:00+00',
  0,
  NULL,
  2340,
  ARRAY['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
  ARRAY['Food', 'Festival', 'Punjab', 'Culture'],
  true,
  NOW()
),

-- Event 4: Tech Summit Chandigarh 2025
(
  '00000000-0000-0001-0000-000000000004',
  'Tech Summit Chandigarh 2025',
  'The biggest technology conference in the region! Featuring talks on AI, blockchain, and startup culture. Network with tech enthusiasts and industry leaders.',
  
  30.7304,
  76.786,
  'PGI Auditorium, Sector 12, Chandigarh 160012',
  'Chandigarh',
  'Chandigarh',
  'Technology',
  '2025-03-05 09:00:00+00',
  '2025-03-05 18:00:00+00',
  2000,
  800,
  567,
  ARRAY['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
  ARRAY['Technology', 'AI', 'Startups', 'Networking'],
  true,
  NOW()
),

-- Event 5: Rose Garden Yoga Retreat
(
  '00000000-0000-0001-0000-000000000005',
  'Rose Garden Yoga Retreat',
  'Start your morning with rejuvenating yoga sessions in the peaceful Rose Garden. All levels welcome, mats provided.',
  
  30.7467,
  76.7688,
  'Zakir Hussain Rose Garden, Sector 16, Chandigarh 160015',
  'Chandigarh',
  'Chandigarh',
  'Health & Wellness',
  '2025-01-25 06:00:00+00',
  '2025-01-25 08:00:00+00',
  300,
  50,
  38,
  ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800'],
  ARRAY['Yoga', 'Wellness', 'Morning', 'Rose Garden'],
  true,
  NOW()
),

-- Event 6: Fashion Show
(
  '00000000-0000-0001-0000-000000000006',
  'Elante Mall Fashion Show 2025',
  'Witness the latest fashion trends! Local and national designers showcase their collections. Red carpet entry for VIP ticket holders.',
  
  30.7041,
  76.8025,
  'Elante Mall, Industrial Area Phase I, Chandigarh 160002',
  'Chandigarh',
  'Chandigarh',
  'Fashion',
  '2025-02-14 19:00:00+00',
  '2025-02-14 22:00:00+00',
  1500,
  400,
  312,
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800'],
  ARRAY['Fashion', 'Design', 'Runway', 'Shopping'],
  true,
  NOW()
),

-- Event 7: Heritage Walk
(
  '00000000-0000-0001-0000-000000000007',
  'Capitol Complex Heritage Walk',
  'Explore Le Corbusier''s architectural masterpiece! Guided tour of the UNESCO World Heritage Site including the High Court, Secretariat, and Open Hand Monument.',
  
  30.7595,
  76.8066,
  'Capitol Complex, Sector 1, Chandigarh 160001',
  'Chandigarh',
  'Chandigarh',
  'Arts & Culture',
  '2025-01-28 10:00:00+00',
  '2025-01-28 13:00:00+00',
  200,
  40,
  28,
  ARRAY['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800'],
  ARRAY['Architecture', 'Heritage', 'UNESCO', 'Le Corbusier'],
  true,
  NOW()
),

-- Event 8: Art Exhibition
(
  '00000000-0000-0001-0000-000000000008',
  'Contemporary Art Exhibition',
  'Contemporary art exhibition featuring works by emerging artists from Punjab and Haryana. Meet the artists and explore diverse art forms.',
  
  30.7285,
  76.7645,
  'Government Museum and Art Gallery, Sector 10, Chandigarh 160011',
  'Chandigarh',
  'Chandigarh',
  'Arts & Culture',
  '2025-02-01 10:00:00+00',
  '2025-02-15 18:00:00+00',
  150,
  NULL,
  234,
  ARRAY['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800'],
  ARRAY['Art', 'Exhibition', 'Contemporary', 'Local Artists'],
  true,
  NOW()
),

-- Event 9: Debate Competition
(
  '00000000-0000-0001-0000-000000000009',
  'Panjab University Debate Competition',
  'Inter-college debate championship covering current affairs, technology, and social issues. Open to all college students.',
  
  30.7634,
  76.7686,
  'Panjab University, Sector 14, Chandigarh 160014',
  'Chandigarh',
  'Chandigarh',
  'Education',
  '2025-02-20 14:00:00+00',
  '2025-02-20 18:00:00+00',
  0,
  200,
  145,
  ARRAY['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'],
  ARRAY['Education', 'Debate', 'Students', 'Competition'],
  true,
  NOW()
),

-- Event 10: Picnic Festival
(
  '00000000-0000-0001-0000-000000000010',
  'Terraced Garden Picnic Festival',
  'Family-friendly picnic day with games, music, and food stalls. Enjoy the beautiful terraced gardens while connecting with the community.',
  
  30.7486,
  76.8092,
  'Terraced Garden, Sector 33, Chandigarh 160020',
  'Chandigarh',
  'Chandigarh',
  'Community',
  '2025-03-15 10:00:00+00',
  '2025-03-15 17:00:00+00',
  0,
  NULL,
  678,
  ARRAY['https://images.unsplash.com/photo-1530126483408-aa533e55bdb2?w=800', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'],
  ARRAY['Family', 'Picnic', 'Community', 'Outdoor'],
  true,
  NOW()
),

-- Event 11: Cricket Tournament
(
  '00000000-0000-0001-0000-000000000011',
  'Cricket Tournament - Sector 42 Stadium',
  'Inter-sector cricket championship! Register your team of 11 players. Trophy and cash prizes for winners.',
  
  30.7213,
  76.7535,
  'Cricket Stadium, Sector 16, Chandigarh 160015',
  'Chandigarh',
  'Chandigarh',
  'Sports & Fitness',
  '2025-03-20 08:00:00+00',
  '2025-03-24 18:00:00+00',
  5000,
  200,
  112,
  ARRAY['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'],
  ARRAY['Cricket', 'Sports', 'Tournament', 'Competition'],
  true,
  NOW()
),

-- Event 12: Startup Pitch Night
(
  '00000000-0000-0001-0000-000000000012',
  'Startup Pitch Night - Sector 17',
  'Calling all entrepreneurs! Pitch your startup ideas to investors and mentors. Networking session and refreshments included.',
  
  30.7393,
  76.7849,
  'Hotel Piccadily, Sector 22, Chandigarh 160022',
  'Chandigarh',
  'Chandigarh',
  'Business & Networking',
  '2025-02-28 18:00:00+00',
  '2025-02-28 21:00:00+00',
  500,
  100,
  78,
  ARRAY['https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800'],
  ARRAY['Startup', 'Business', 'Networking', 'Investment'],
  true,
  NOW()
),

-- Event 13: Book Fair
(
  '00000000-0000-0001-0000-000000000013',
  'Chandigarh Book Fair 2025',
  'A paradise for book lovers! Browse thousands of books, meet authors, and attend reading sessions. Special discounts on all purchases.',
  
  30.7369,
  76.7896,
  'Parade Ground, Sector 17, Chandigarh 160017',
  'Chandigarh',
  'Chandigarh',
  'Arts & Culture',
  '2025-04-10 10:00:00+00',
  '2025-04-17 20:00:00+00',
  50,
  NULL,
  4567,
  ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800'],
  ARRAY['Books', 'Literature', 'Reading', 'Authors'],
  true,
  NOW()
),

-- Event 14: Cycling Rally
(
  '00000000-0000-0001-0000-000000000014',
  'Leisure Valley Cycling Rally',
  'Join the city-wide cycling rally through Leisure Valley! Promoting fitness and eco-friendly transportation. All ages welcome.',
  
  30.7394,
  76.7739,
  'Leisure Valley, Sector 10, Chandigarh 160011',
  'Chandigarh',
  'Chandigarh',
  'Sports & Fitness',
  '2025-03-10 07:00:00+00',
  '2025-03-10 10:00:00+00',
  0,
  300,
  245,
  ARRAY['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800', 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800'],
  ARRAY['Cycling', 'Fitness', 'Environment', 'Community'],
  true,
  NOW()
),

-- Event 15: Children's Workshop
(
  '00000000-0000-0001-0000-000000000015',
  'International Dolls Museum Workshop',
  'Creative workshop for children at the International Dolls Museum. Learn doll-making and storytelling. Limited seats available!',
  
  30.7488,
  76.7747,
  'International Dolls Museum, Sector 23, Chandigarh 160023',
  'Chandigarh',
  'Chandigarh',
  'Education',
  '2025-02-25 14:00:00+00',
  '2025-02-25 17:00:00+00',
  400,
  30,
  22,
  ARRAY['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800', 'https://images.unsplash.com/photo-1587628604439-c3f4e2e4ddf4?w=800'],
  ARRAY['Children', 'Workshop', 'Creative', 'Education'],
  true,
  NOW()
),

-- Event 16: PECFEST
(
  '00000000-0000-0001-0000-000000000016',
  'PECFEST 2025',
  'The annual cultural and technical extravaganza of PEC Chandigarh! Experience music, innovation, and creativity with exciting competitions, live performances, and exhibitions.',
  
  30.764388,
  76.784462,
  'Punjab Engineering College, Sector 12, Chandigarh 160012',
  'Chandigarh',
  'Chandigarh',
  'Festival',
  '2025-03-10 10:00:00+00',
  '2025-03-12 22:00:00+00',
  0,
  5000,
  3870,
  ARRAY['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'],
  ARRAY['Cultural', 'Technical', 'Music', 'Festival'],
  true,
  NOW()
),

-- Event 17: Treasure Hunt
(
  '00000000-0000-0001-0000-000000000017',
  'PECFEST Treasure Hunt',
  'An adventurous treasure hunt across the PEC campus! Decode clues, solve puzzles, and race your way to hidden treasures with your team.',
  
  30.767282,
  76.785162,
  'Punjab Engineering College, Sector 12, Chandigarh 160012',
  'Chandigarh',
  'Chandigarh',
  'Competition',
  '2025-03-11 09:00:00+00',
  '2025-03-11 13:00:00+00',
  150,
  100,
  76,
  ARRAY['https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800', 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?w=800'],
  ARRAY['Adventure', 'Fun', 'Puzzle', 'Team'],
  true,
  NOW()
),

-- Event 18: Mystery Event
(
  '00000000-0000-0001-0000-000000000018',
  'PECFEST: Unveil the Culprit',
  'Step into the shoes of a detective in this thrilling crime-solving event! Analyze clues, interrogate suspects, and use your wit to catch the culprit before time runs out.',
  
  30.766419,
  76.786549,
  'Punjab Engineering College, Sector 12, Chandigarh 160012',
  'Chandigarh',
  'Chandigarh',
  'Mystery',
  '2025-03-11 14:00:00+00',
  '2025-03-11 17:30:00+00',
  100,
  80,
  59,
  ARRAY['https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800', 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=800'],
  ARRAY['Mystery', 'Thriller', 'Teamwork', 'Logic'],
  true,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify the data was inserted
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_profiles FROM profiles;

-- Show some sample events
SELECT 
  id, 
  title, 
  city, 
  category, 
  price, 
  current_attendees,
  start_date
FROM events 
ORDER BY start_date 
LIMIT 5;
