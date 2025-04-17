import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEvents } from '../context/EventContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { toast } from 'sonner-native';

export default function VendorDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { vendors } = useEvents();
  const [showContactModal, setShowContactModal] = useState(false);
  const [inquiry, setInquiry] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  
  const vendorId = route.params?.vendorId;
  const vendor = vendors.find(vendor => vendor.id === vendorId);
  
  if (!vendor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FFB6C1" />
          <Text style={styles.errorText}>Vendor not found</Text>
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

  const handlePhone = () => {
    Linking.openURL(`tel:+91 9581440276`);
  };
  const handleEmail = () => {
    Linking.openURL(`mailto:₹{vendor.contact}`);
  };

  const handleSubmitInquiry = () => {
    if (!inquiry.trim()) {
      toast.error('Please enter your inquiry');
      return;
    }
    
    if (!name.trim() || !email.trim()) {
      toast.error('Please enter your name and email');
      return;
    }
    
    // In a real app, would send the inquiry to the backend
    toast.success('Inquiry sent successfully!');
    setShowContactModal(false);
    
    // Reset form
    setInquiry('');
    setName('');
    setEmail('');
    setPhone('');
    setDate('');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FontAwesome key={i} name="star" size={16} color="#FFD700" />);
      } else if (i === fullStars && halfStar) {
        stars.push(<FontAwesome key={i} name="star-half-o" size={16} color="#FFD700" />);
      } else {
        stars.push(<FontAwesome key={i} name="star-o" size={16} color="#FFD700" />);
      }
    }
    
    return (
      <View style={styles.starsContainer}>
        {stars}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: vendor.image }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          >
            <View style={styles.vendorHeader}>
              <Text style={styles.vendorName}>{vendor.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{vendor.category}</Text>
              </View>
            </View>
          </LinearGradient>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <View style={styles.ratingSection}>
            {renderStars(vendor.rating)}
            <Text style={styles.reviewCount}>Based on 48 reviews</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              {vendor.description}
            </Text>
          </View>
          
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, {backgroundColor: '#FFE0E9'}]}>
                <Ionicons name="cash-outline" size={24} color="#FF4A87" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Price Range</Text>
                <Text style={styles.infoValue}>{vendor.price}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, {backgroundColor: '#E0F4FF'}]}>
                <Ionicons name="location-outline" size={24} color="#4A90FF" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{vendor.location}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, {backgroundColor: '#F5E6FF'}]}>
                <Ionicons name="mail-outline" size={24} color="#9C27B0" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{vendor.contact}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services</Text>
            
            <View style={styles.servicesList}>
              {vendor.category === 'Catering' && (
                <>
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="restaurant-menu" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Custom menu design</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="people" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Staff and servers included</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="local-dining" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Premium dinnerware</Text>
                  </View>
                </>
              )}
              
              {vendor.category === 'Florist' && (
                <>
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="local-florist" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Custom floral arrangements</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="event" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Venue decoration</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="card-giftcard" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Bridal bouquets and boutonnieres</Text>
                  </View>
                </>
              )}
              
              {vendor.category === 'Entertainment' && (
                <>
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="music-note" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Professional DJ services</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="speaker" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Premium sound equipment</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="lightbulb" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Lighting and visual effects</Text>
                  </View>
                </>
              )}
              
              {vendor.category === 'Photography' && (
                <>
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="camera-alt" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Professional photography</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="videocam" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Video recording and editing</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="photo-album" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Photo albums and prints</Text>
                  </View>
                </>
              )}
              
              {vendor.category === 'Venue' && (
                <>
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="room" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Event space rental</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="chair" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Furniture and decor</Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <MaterialIcons name="local-parking" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.serviceText}>Parking and valet services</Text>
                  </View>
                </>
              )}
            </View>
          </View>
          
          <Text style={styles.galleryTitle}>Photo Gallery</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryContainer}
          >
            <Image 
              source={{ 
                uri: `https://api.a0.dev/assets/image?text=₹{encodeURIComponent(vendor.category)}%20₹{encodeURIComponent(vendor.name)}%201&aspect=1:1&seed=1`
              }} 
              style={styles.galleryImage} 
            />
            <Image 
              source={{ 
                uri: `https://api.a0.dev/assets/image?text=₹{encodeURIComponent(vendor.category)}%20₹{encodeURIComponent(vendor.name)}%202&aspect=1:1&seed=2`
              }} 
              style={styles.galleryImage} 
            />
            <Image 
              source={{ 
                uri: `https://api.a0.dev/assets/image?text=₹{encodeURIComponent(vendor.category)}%20₹{encodeURIComponent(vendor.name)}%203&aspect=1:1&seed=3`
              }} 
              style={styles.galleryImage} 
            />
            <Image 
              source={{ 
                uri: `https://api.a0.dev/assets/image?text=₹{encodeURIComponent(vendor.category)}%20₹{encodeURIComponent(vendor.name)}%204&aspect=1:1&seed=4`
              }} 
              style={styles.galleryImage} 
            />
          </ScrollView>
          
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Get in touch</Text>
            <Text style={styles.contactSubtitle}>
              Contact {vendor.name} directly or send an inquiry through our platform.
            </Text>
            
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={styles.phoneButton}
                onPress={handlePhone}
              >
                <Ionicons name="call" size={20} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.emailButton}
                onPress={handleEmail}
              >
                <Ionicons name="mail" size={20} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.inquiryButton}
                onPress={() => setShowContactModal(true)}
              >
                <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Inquiry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Contact Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact {vendor.name}</Text>
              <TouchableOpacity 
                onPress={() => setShowContactModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Your Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone (Optional)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Event Date (Optional)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="MM/DD/YYYY"
                  value={date}
                  onChangeText={setDate}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Your Inquiry</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Describe your event and what services you need..."
                  value={inquiry}
                  onChangeText={setInquiry}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitInquiry}
              >
                <Text style={styles.submitButtonText}>Submit Inquiry</Text>
              </TouchableOpacity>
              
              <Text style={styles.privacyText}>
                By submitting this form, you agree to our terms and privacy policy.
              </Text>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
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
  vendorHeader: {
    width: '80%',
  },
  vendorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: '500',
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
  content: {
    flex: 1,
    padding: 16,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666666',
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
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  servicesList: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F8E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  galleryContainer: {
    marginBottom: 24,
  },
  galleryImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 8,
  },
  contactSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phoneButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 8,
  },
  emailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90FF',
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 8,
  },
  inquiryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4A87',
    paddingVertical: 12,
    borderRadius: 24,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF4A87',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  privacyText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 16,
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