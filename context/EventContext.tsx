import React, { createContext, useContext, useState } from 'react';

// Define types
interface Event {
  id: number;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  type: string;
  image: string;
  status?: string;
  price?: string;
  guests?: number;
}

interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  image: string;
  description: string;
  price: string;
  contact: string;
  location: string;
}

interface EventContextType {
  upcomingEvents: Event[];
  pastEvents: Event[];
  popularPackages: Event[];
  reminders: Event[];
  vendors: Vendor[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: number, updatedEvent: Partial<Event>) => void;
  deleteEvent: (id: number) => void;
}

const EventContext = createContext<EventContextType | null>(null);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Sarah's Birthday Party",
      date: "2025-03-15",
      time: "7:00 PM",
      location: "Rooftop Garden",
      description: "Surprise birthday celebration with friends and family.",
      type: "Birthday",
      image: "https://api.a0.dev/assets/image?text=surprise%20birthday%20celebration%20rooftop%20party&aspect=16:9",
      status: "Confirmed",
      guests: 25
    },
    {
      id: 2,
      title: "Johnson Wedding Anniversary",
      date: "2025-04-10",
      time: "6:30 PM",
      location: "Golden Gate Hotel",
      description: "25th wedding anniversary celebration.",
      type: "Anniversary",
      image: "https://api.a0.dev/assets/image?text=elegant%20wedding%20anniversary%20celebration&aspect=16:9",
      status: "Planning",
      guests: 100
    }
  ]);

  const [pastEvents, setPastEvents] = useState<Event[]>([
    {
      id: 3,
      title: "Corporate Retreat",
      date: "2025-01-20",
      location: "Mountain View Resort",
      description: "Annual team building and strategy session.",
      type: "Corporate",
      image: "https://api.a0.dev/assets/image?text=corporate%20retreat%20team%20building&aspect=16:9",
      status: "Completed",
      guests: 50
    }
  ]);

  const [popularPackages, setPopularPackages] = useState<Event[]>([
    {
      id: 101,
      title: "Premium Wedding Package",
      description: "All-inclusive wedding planning service with premium venue, catering, and photography.",
      type: "Package",
      image: "https://api.a0.dev/assets/image?text=luxury%20wedding%20venue%20celebration&aspect=16:9",
      price: "₹15,000",
      date: ""
    },
    {
      id: 102,
      title: "Birthday Bash Package",
      description: "Complete birthday planning with decorations, entertainment, and catering services.",
      type: "Package",
      image: "https://api.a0.dev/assets/image?text=colorful%20birthday%20bash%20celebration&aspect=16:9",
      price: "₹2,500",
      date: ""
    },
    {
      id: 103,
      title: "Corporate Event Package",
      description: "Professional corporate event planning including venue, A/V equipment, and catering.",
      type: "Package",
      image: "https://api.a0.dev/assets/image?text=professional%20corporate%20event%20conference%20room&aspect=16:9",
      price: "₹7,500",
      date: ""
    }
  ]);

  const [reminders, setReminders] = useState<Event[]>([
    {
      id: 201,
      title: "Mom's Birthday",
      date: "2025-06-12",
      type: "Reminder",
      image: "https://api.a0.dev/assets/image?text=mother%20birthday%20reminder&aspect=1:1"
    },
    {
      id: 202,
      title: "Wedding Anniversary",
      date: "2025-05-22",
      type: "Reminder",
      image: "https://api.a0.dev/assets/image?text=wedding%20anniversary%20reminder&aspect=1:1"
    },
    {
      id: 203,
      title: "Team Celebration",
      date: "2025-04-30",
      type: "Reminder",
      image: "https://api.a0.dev/assets/image?text=office%20team%20celebration&aspect=1:1"
    }
  ]);

  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: 1,
      name: "Elegant Catering",
      category: "Catering",
      rating: 4.8,
      image: "https://api.a0.dev/assets/image?text=elegant%20catering%20service%20food%20preparation&aspect=16:9",
      description: "Premium catering service for all types of events with custom menu options.",
      price: "₹25-45 per person",
      contact: "g.yuvakishorereddy@gmail.com",
      location: "Madurai, Mdu"
    },
    {
      id: 2,
      name: "Bloom Florists",
      category: "Florist",
      rating: 4.7,
      image: "https://api.a0.dev/assets/image?text=professional%20florist%20arrangement%20wedding%20bouquet&aspect=16:9",
      description: "Beautiful floral arrangements for weddings, corporate events, and parties.",
      price: "₹300-1500",
      contact: "g.yuvakishorereddy@gmail.com",
      location: "Madurai, Mdu"
    },
    {
      id: 3,
      name: "Sound Masters",
      category: "Entertainment",
      rating: 4.9,
      image: "https://api.a0.dev/assets/image?text=dj%20equipment%20music%20entertainment%20event&aspect=16:9",
      description: "Professional DJs and sound equipment for any occasion.",
      price: "₹750-2000",
      contact: "g.yuvakishorereddy@gmail.com",
      location: "Madurai, Mdu"
    },
    {
      id: 4,
      name: "Capture Moments Photography",
      category: "Photography",
      rating: 4.6,
      image: "https://api.a0.dev/assets/image?text=professional%20photographer%20wedding%20event&aspect=16:9",
      description: "Expert photographers to capture your special moments.",
      price: "₹1200-3500",
      contact: "g.yuvakishorereddy@gmail.com",
      location: "Madurai, Mdu"
    },
    {
      id: 5,
      name: "Grand Venues",
      category: "Venue",
      rating: 4.5,
      image: "https://api.a0.dev/assets/image?text=luxury%20event%20venue%20ballroom&aspect=16:9",
      description: "Elegant venues for weddings, corporate events, and special occasions.",
      price: "₹2000-10000",
      contact: "g.yuvakishorereddy@gmail.com",
      location: "Madurai, Mdu"
    }
  ]);

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: Date.now(),
    };
    
    if (event.type === 'Reminder') {
      setReminders([...reminders, newEvent as Event]);
    } else {
      setUpcomingEvents([...upcomingEvents, newEvent as Event]);
    }
  };

  const updateEvent = (id: number, updatedEvent: Partial<Event>) => {
    // Check in which array the event exists
    if (upcomingEvents.some(event => event.id === id)) {
      setUpcomingEvents(
        upcomingEvents.map(event => 
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      );
    } else if (pastEvents.some(event => event.id === id)) {
      setPastEvents(
        pastEvents.map(event => 
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      );
    } else if (reminders.some(event => event.id === id)) {
      setReminders(
        reminders.map(event => 
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      );
    }
  };

  const deleteEvent = (id: number) => {
    setUpcomingEvents(upcomingEvents.filter(event => event.id !== id));
    setPastEvents(pastEvents.filter(event => event.id !== id));
    setReminders(reminders.filter(event => event.id !== id));
  };

  return (
    <EventContext.Provider value={{
      upcomingEvents,
      pastEvents,
      popularPackages,
      reminders,
      vendors,
      addEvent,
      updateEvent,
      deleteEvent
    }}>
      {children}
    </EventContext.Provider>
  );
};