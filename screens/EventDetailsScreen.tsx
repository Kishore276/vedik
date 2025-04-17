import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions,
  Share,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEvents } from '../context/EventContext';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import { toast } from 'sonner-native';

const { width } = Dimensions.get('window');

export default function EventDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { upcomingEvents, pastEvents, popularPackages } = useEvents();
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const eventId = route.params?.eventId;
  
  // Find the event from all possible sources
  const event = 
    [...upcomingEvents, ...pastEvents, ...popularPackages]
    .find(event => event.id === eventId);
  
  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FFB6C1" />
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity 
            style={styles.backButtonLarge}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isPackage = event.type === 'Package';
  
  const calculateTimeLeft = () => {
    if (!event.date || isPackage) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(event.date);
    const timeDiff = eventDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days ago`;
    if (daysLeft === 0) return 'Today';
    if (daysLeft === 1) return 'Tomorrow';
    return `${daysLeft} days left`;
  };

  const formatEventDate = () => {
    if (!event.date || isPackage) return '';
    
    const eventDate = new Date(event.date);
    return format(eventDate, 'EEEE, MMMM d, yyyy');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title} on ${formatEventDate()}${event.location ? ` at ${event.location}` : ''}`,
      });
    } catch (error) {
      toast.error('Could not share event');
    }
  };

  const handleCopy = () => {
    // In a real app, would copy event details to clipboard
    toast.success('Event details copied to clipboard!');
  };

  const handleContactSupport = () => {
    // In a real app, would open support chat or email
    toast.info('Contacting support...');
  };

  const handleBookPackage = () => {
    // In a real app, would navigate to booking flow
    toast.success('Package booking initiated!');
  };

  const handleOpenMaps = () => {
    if (event.location) {
      const query = encodeURIComponent(event.location);
      const url = Platform.select({
        ios: `maps:0,0?q=${query}`,
        android: `geo:0,0?q=${query}`,
      });
      
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          toast.error('Cannot open maps');
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          >
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              {!isPackage && (
                <Text style={styles.eventDate}>{formatEventDate()}</Text>
              )}
            </View>
          </LinearGradient>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
              <Ionicons name="copy-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.content}>
          {!isPackage && (
            <View style={styles.infoCards}>
              <View style={[styles.infoCard, {backgroundColor: '#FFE0E9'}]}>
                <Ionicons name="time-outline" size={24} color="#FF4A87" />
                <Text style={styles.infoValue}>{event.time || 'TBD'}</Text>
                <Text style={styles.infoLabel}>Time</Text>
              </View>
              
              <View style={[styles.infoCard, {backgroundColor: '#E0F4FF'}]}>
                <Ionicons name="location-outline" size={24} color="#4A90FF" />
                <Text style={styles.infoValue} numberOfLines={1}>
                  {event.location || 'TBD'}
                </Text>
                <Text style={styles.infoLabel}>Location</Text>
              </View>
              
              {event.guests && (
                <View style={[styles.infoCard, {backgroundColor: '#F5E6FF'}]}>
                  <Ionicons name="people-outline" size={24} color="#9C27B0" />
                  <Text style={styles.infoValue}>{event.guests}</Text>
                  <Text style={styles.infoLabel}>Guests</Text>
                </View>
              )}
              
              {calculateTimeLeft() && (
                <View style={[styles.infoCard, {backgroundColor: '#E6F8E6'}]}>
                  <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
                  <Text style={styles.infoValue}>{calculateTimeLeft()}</Text>
                  <Text style={styles.infoLabel}>Countdown</Text>
                </View>
              )}
            </View>
          )}
          
          {isPackage && event.price && (
            <View style={styles.packagePriceContainer}>
              <Text style={styles.packagePriceLabel}>Starting at</Text>
              <Text style={styles.packagePrice}>{event.price}</Text>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isPackage ? 'Package Details' : 'Event Details'}
            </Text>
            <Text style={[
              styles.description, 
              !showFullDescription && styles.descriptionTruncated
            ]}>
              {event.description || 'No description available.'}
            </Text>
            
            {event.description && event.description.length > 100 && (
              <TouchableOpacity 
                onPress={() => setShowFullDescription(!showFullDescription)}
                style={styles.readMoreButton}
              >
                <Text style={styles.readMoreText}>
                  {showFullDescription ? 'Show less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {!isPackage && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              
              <TouchableOpacity 
                style={styles.locationCard}
                onPress={handleOpenMaps}
              >
                <View style={styles.locationDetails}>
                  <Ionicons name="location" size={24} color="#FF4A87" />
                  <Text style={styles.locationText}>{event.location || 'Location to be determined'}</Text>
                </View>
                <Ionicons name="navigate-circle-outline" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isPackage ? 'What\'s Included' : 'Event Status'}
            </Text>
            
            {isPackage ? (
              <View style={styles.includesList}>
                <View style={styles.includeItem}>
                  <View style={styles.includeIconContainer}>
                    <FontAwesome5 name="calendar-check" size={16} color="#4CAF50" />
                  </View>
                  <Text style={styles.includeText}>Professional planning and coordination</Text>
                </View>
                
                <View style={styles.includeItem}>
                  <View style={styles.includeIconContainer}>
                    <FontAwesome5 name="utensils" size={16} color="#4CAF50" />
                  </View>
                  <Text style={styles.includeText}>Catering services with custom menu options</Text>
                </View>
                
                <View style={styles.includeItem}>
                  <View style={styles.includeIconContainer}>
                    <FontAwesome5 name="camera" size={16} color="#4CAF50" />
                  </View>
                  <Text style={styles.includeText}>Photography and video services</Text>
                </View>
                
                <View style={styles.includeItem}>
                  <View style={styles.includeIconContainer}>
                    <FontAwesome5 name="music" size={16} color="#4CAF50" />
                  </View>
                  <Text style={styles.includeText}>Entertainment and sound equipment</Text>
                </View>
                
                <View style={styles.includeItem}>
                  <View style={styles.includeIconContainer}>
                    <FontAwesome5 name="flower" size={16} color="#4CAF50" />
                  </View>
                  <Text style={styles.includeText}>Decoration and floral arrangements</Text>
                </View>
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge, 
                  { 
                    backgroundColor: event.status === 'Confirmed' ? '#E6F8E6' : 
                                    event.status === 'Planning' ? '#FFE0E9' :
                                    event.status === 'Completed' ? '#E0E0E0' : '#FFF9E0'
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { 
                      color: event.status === 'Confirmed' ? '#4CAF50' : 
                             event.status === 'Planning' ? '#FF4A87' :
                             event.status === 'Completed' ? '#666666' : '#FFC107'
                    }
                  ]}>
                    {event.status || 'Not set'}
                  </Text>
                </View>
                
                <Text style={styles.statusDescription}>
                  {event.status === 'Confirmed' ? 'Your event is confirmed and ready to go!' : 
                   event.status === 'Planning' ? 'This event is currently in the planning phase.' :
                   event.status === 'Completed' ? 'This event has been completed.' : 
                   'Status information unavailable.'}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.actionButtons}>
            {isPackage ? (
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleBookPackage}
              >
                <Text style={styles.primaryButtonText}>Book This Package</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => navigation.navigate('VendorsTab')}
              >
                <Text style={styles.primaryButtonText}>Find Vendors</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleContactSupport}
            >
              <Text style={styles.secondaryButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 250,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  eventHeader: {
    width: '80%',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoCard: {
    width: (width - 32) / 2 - 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  packagePriceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  packagePriceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  packagePrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  descriptionTruncated: {
    maxHeight: 100,
    overflow: 'hidden',
  },
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF4A87',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  includesList: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  includeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F8E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  includeText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  statusContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666666',
  },
  actionButtons: {
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#FF4A87',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4A87',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4A87',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonLarge: {
    backgroundColor: '#FF4A87',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});