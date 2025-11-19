-- QUICK START: Enable Chat in 3 Steps
-- Run these queries in Supabase SQL Editor in order

-- ============================================
-- STEP 1: ENABLE REALTIME (MOST IMPORTANT!)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================
-- STEP 2: CREATE CHAT ROOMS FOR ALL EVENTS
-- ============================================
DO $$
DECLARE
  event_record RECORD;
  room_id UUID;
BEGIN
  FOR event_record IN 
    SELECT id, title, organizer_id 
    FROM events 
    WHERE chat_room_id IS NULL
  LOOP
    INSERT INTO chat_rooms (name, type, event_id, created_by)
    VALUES (
      event_record.title || ' - Chat',
      'event',
      event_record.id,
      event_record.organizer_id
    )
    RETURNING id INTO room_id;
    
    UPDATE events 
    SET chat_room_id = room_id
    WHERE id = event_record.id;
  END LOOP;
END $$;

-- ============================================
-- STEP 3: VERIFY IT WORKED
-- ============================================
-- Check events have chat rooms
SELECT 
  title,
  chat_room_id,
  (SELECT name FROM chat_rooms WHERE id = chat_room_id) as room_name
FROM events
LIMIT 10;

-- Check realtime is enabled
SELECT * FROM pg_publication_tables WHERE tablename = 'messages';

-- ============================================
-- DONE! Now test in your app:
-- 1. Open app in 2 different browsers
-- 2. Join same event in both
-- 3. Send message in one browser
-- 4. Should appear instantly in other browser! ✨
-- ============================================
