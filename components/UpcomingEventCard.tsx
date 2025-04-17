import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface UpcomingEventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    time?: string;
    location?: string;
    type: string;
    image: string;
    status?: string;
  };
}

const UpcomingEventCard = ({ event }: UpcomingEventCardProps) => {
  const navigation = useNavigation();
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  // Get day name (Mon, Tue, etc)
  const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'short' });

  // Calculate days left
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timeDiff = eventDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const getDaysLeftText = () => {
    if (daysLeft === 0) return 'Today';
    if (daysLeft === 1) return 'Tomorrow';
    if (daysLeft > 0) return `₹{daysLeft} days left`;
    return 'Past event';
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
    >
      <Image source={{ uri: event.image }} style={styles.image} />
      <View style={styles.dateContainer}>
        <Text style={styles.dayName}>{dayName}</Text>
        <Text style={styles.dateNumber}>{formattedDate.split(' ')[1]}</Text>
        <Text style={styles.monthName}>{formattedDate.split(' ')[0]}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color="#666666" />
            <Text style={styles.infoText}>{event.time || 'TBD'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={14} color="#666666" />
            <Text style={styles.infoText} numberOfLines={1}>{event.location || 'TBD'}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          {event.status && (
            <View style={[
              styles.statusBadge, 
              { backgroundColor: event.status === 'Confirmed' ? '#E6F8E6' : '#FFE0E9' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: event.status === 'Confirmed' ? '#4CAF50' : '#FF4A87' }
              ]}>
                {event.status}
              </Text>
            </View>
          )}
          
          <Text style={styles.daysLeft}>{getDaysLeftText()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
  },
  dateContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    minWidth: 50,
  },
  dayName: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  monthName: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  daysLeft: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF4A87',
  }
});

export default UpcomingEventCard;