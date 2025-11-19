-- Create Chat Rooms for All Events
-- Run this in Supabase SQL Editor after events are created

-- This script creates a chat room for every event in the database

DO $$
DECLARE
  event_record RECORD;
  room_id UUID;
  created_count INTEGER := 0;
BEGIN
  -- Loop through all events
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

-- Verify chat rooms were created
SELECT 
  e.id as event_id,
  e.title as event_title,
  cr.id as chat_room_id,
  cr.name as chat_room_name,
  cr.type as room_type,
  cr.created_at
FROM events e
LEFT JOIN chat_rooms cr ON e.chat_room_id = cr.id
ORDER BY e.created_at DESC;

-- Count events with and without chat rooms
SELECT 
  COUNT(*) as total_events,
  COUNT(chat_room_id) as events_with_chat,
  COUNT(*) - COUNT(chat_room_id) as events_without_chat
FROM events;
