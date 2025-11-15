'use client'

import { Event } from '@/stores/events-store'
import { Button } from '@/components/ui/button'
import { formatDate, formatPrice } from '@/lib/utils'
import { Calendar, MapPin, Users, Tag, Star } from 'lucide-react'
import { useEventsStore } from '@/stores/events-store'

interface EventPopupProps {
  event: Event
}

export function EventPopup({ event }: EventPopupProps) {
  const { selectEvent, joinEvent } = useEventsStore()

  const handleJoinEvent = async () => {
    try {
      await joinEvent(event.id)
    } catch (error) {
      console.error('Failed to join event:', error)
    }
  }

  const handleViewDetails = () => {
    selectEvent(event)
  }

  return (
    <div className="w-80 p-4 space-y-3">
      {/* Event Image */}
      {event.images.length > 0 && (
        <div className="w-full h-32 rounded-lg overflow-hidden">
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Event Title */}
      <div>
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
          {event.title}
        </h3>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-sm text-gray-600">by {event.organizer.name}</span>
          {event.organizer.isVerified && (
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          )}
        </div>
      </div>

      {/* Event Info */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(event.startDate)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{event.location.address}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{event.currentAttendees} attending</span>
          {event.maxAttendees && (
            <span className="text-gray-400">/ {event.maxAttendees}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Tag className="h-4 w-4" />
          <span>{event.category}</span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <span className="text-lg font-bold text-primary-600">
          {formatPrice(event.price)}
        </span>
      </div>

      {/* Description Preview */}
      <div className="text-sm text-gray-600 line-clamp-3">
        {event.description}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          size="sm"
          onClick={handleJoinEvent}
          className="flex-1"
        >
          {event.price > 0 ? 'Buy Ticket' : 'Join Event'}
        </Button>
      </div>

      {/* Chat Button */}
      {event.chatRoomId && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-primary-600 hover:text-primary-700"
        >
          💬 Join Event Chat
        </Button>
      )}
    </div>
  )
}