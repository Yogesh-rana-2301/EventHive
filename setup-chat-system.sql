-- Chat System Setup for EventHive
-- Complete setup guide for enabling real-time chat

-- STEP 1: Verify Tables Exist
-- Check if chat_rooms and messages tables are already created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('chat_rooms', 'messages');

-- If tables don't exist, run the main supabase-schema.sql first!

-- STEP 2: Enable Realtime for Chat Tables
-- This is REQUIRED for real-time chat functionality

-- Enable realtime on messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime on chat_rooms table (optional, but recommended)
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;

-- STEP 3: Create Chat Rooms for All Existing Events
-- This creates a chat room for every event that doesn't have one

DO $$
DECLARE
  event_record RECORD;
  room_id UUID;
  created_count INTEGER := 0;
BEGIN
  FOR event_record IN 
    SELECT id, title, organizer_id 
    FROM events 
    WHERE chat_room_id IS NULL
  LOOP
    -- Create a chat room for this event
    INSERT INTO chat_rooms (
      name,
      type,
      event_id,
      created_by
    ) VALUES (
      event_record.title || ' - Chat',
      'event',
      event_record.id,
      event_record.organizer_id
    )
    RETURNING id INTO room_id;
    
    -- Update the event with the chat room ID
    UPDATE events 
    SET chat_room_id = room_id
    WHERE id = event_record.id;
    
    created_count := created_count + 1;
    
    RAISE NOTICE 'Created chat room % for event: %', room_id, event_record.title;
  END LOOP;
  
  RAISE NOTICE 'Successfully created % chat rooms!', created_count;
END $$;

-- STEP 4: Verify Setup
-- Check that all events have chat rooms
SELECT 
  e.id as event_id,
  e.title as event_title,
  e.chat_room_id,
  cr.name as chat_room_name,
  cr.type,
  (SELECT COUNT(*) FROM messages WHERE room_id = cr.id) as message_count
FROM events e
LEFT JOIN chat_rooms cr ON e.chat_room_id = cr.id
ORDER BY e.created_at DESC
LIMIT 20;

-- Count statistics
SELECT 
  COUNT(*) as total_events,
  COUNT(chat_room_id) as events_with_chat,
  COUNT(*) - COUNT(chat_room_id) as events_without_chat
FROM events;

-- STEP 5: Test Message Insert (Optional)
-- Insert a test message to verify everything works
-- Replace <room_id> and <user_id> with actual values

/*
INSERT INTO messages (room_id, user_id, content, type)
VALUES (
  '<room_id>',  -- Get from chat_rooms table
  '<user_id>',  -- Get from profiles table
  'Test message - chat system is working!',
  'text'
);
*/

-- STEP 6: Check Realtime is Enabled
-- Verify that realtime replication is enabled
SELECT 
  schemaname,
  tablename,
  pubname
FROM pg_publication_tables
WHERE tablename IN ('messages', 'chat_rooms');

-- Expected output should show 'messages' table in 'supabase_realtime' publication

-- STEP 7: Clean Up Old Test Messages (Optional)
-- If you want to remove test messages
-- DELETE FROM messages WHERE content LIKE '%test%' OR content LIKE '%Test%';

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If messages aren't showing up in real-time:

-- 1. Check if Realtime is enabled in Supabase Dashboard:
--    Database > Replication > Enable for 'messages' table

-- 2. Verify RLS policies allow reading messages:
SELECT * FROM pg_policies WHERE tablename = 'messages';

-- 3. Check for any error messages in browser console

-- 4. Verify user is authenticated:
--    Should see user ID in Supabase Auth dashboard

-- 5. Test that messages are actually being inserted:
SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;

-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Delete messages older than 30 days
DELETE FROM messages 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Get most active chat rooms
SELECT 
  cr.name,
  cr.type,
  COUNT(m.id) as message_count,
  MAX(m.created_at) as last_message_at
FROM chat_rooms cr
LEFT JOIN messages m ON cr.id = m.room_id
GROUP BY cr.id, cr.name, cr.type
ORDER BY message_count DESC
LIMIT 10;

-- Get users with most messages
SELECT 
  p.name,
  p.email,
  COUNT(m.id) as message_count
FROM profiles p
JOIN messages m ON p.id = m.user_id
GROUP BY p.id, p.name, p.email
ORDER BY message_count DESC
LIMIT 10;
