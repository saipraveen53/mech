import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, PanResponder, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TrackingStatus = 'searching' | 'accepted' | 'on_the_way' | 'arrived';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 80; // 40px padding on each side
const THUMB_SIZE = 56;
const TRACK_HEIGHT = 64;

// Dynamic import for MapView based on platform
let MapView: any;
let Marker: any;

if (Platform.OS === 'web') {
  const { default: WebMapView, Marker: WebMarker } = require('@teovilla/react-native-web-maps');
  MapView = WebMapView;
  Marker = WebMarker;
} else {
  const { default: NativeMapView, Marker: NativeMarker } = require('react-native-maps');
  MapView = NativeMapView;
  Marker = NativeMarker;
}

export default function TrackingScreen() {
  const { problem } = useLocalSearchParams();
  const [status, setStatus] = useState<TrackingStatus>('searching');
  const [timeLeft, setTimeLeft] = useState(10);
  const [mechanicName, setMechanicName] = useState('');
  const [showSlider, setShowSlider] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Slider animation values
  const pan = useRef(new Animated.ValueXY()).current;
  const [sliderWidth, setSliderWidth] = useState(SLIDER_WIDTH);
  const [isSlidingComplete, setIsSlidingComplete] = useState(false);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      pan.setValue({ x: 0, y: 0 });
    };
  }, []);

  // PanResponder for custom slider
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Start sliding
      },
      onPanResponderMove: (_, gesture) => {
        if (!isSlidingComplete && !isCompleting) {
          const newX = Math.max(0, Math.min(gesture.dx, sliderWidth - THUMB_SIZE));
          pan.setValue({ x: newX, y: 0 });
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const currentX = gesture.dx;
        const threshold = sliderWidth - THUMB_SIZE;
        
        // If slid more than 80% of the way, complete the action
        if (currentX >= threshold * 0.8 && !isSlidingComplete && !isCompleting) {
          // Complete the slide
          setIsSlidingComplete(true);
          setIsCompleting(true);
          
          // Animate to the end
          Animated.spring(pan, {
            toValue: { x: threshold, y: 0 },
            useNativeDriver: false,
            speed: 12,
            bounciness: 8,
          }).start();
          
          // Navigate to payment after animation
          setTimeout(() => {
            router.replace('/payment');
          }, 300);
        } else {
          // Reset to start
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            speed: 12,
            bounciness: 8,
          }).start();
          
          if (!isSlidingComplete && !isCompleting) {
            setTimeout(() => {
            // @ts-ignore
              if (pan.x._value < threshold * 0.8 && pan.x._value > 5) {
                Alert.alert(
                  'Payment Cancelled',
                  'You cancelled the payment. Would you like to go back?',
                  [
                    { text: 'Stay', style: 'cancel', onPress: () => {
                      Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                      }).start();
                    }},
                    { text: 'Go Back', onPress: () => router.back() }
                  ]
                );
              }
            }, 500);
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    const initTimer = setTimeout(() => {
      const acceptTimer = setTimeout(() => {
        setStatus('accepted');
        setMechanicName('Raju Mechanic');
      }, 10000);

      const onWayTimer = setTimeout(() => {
        setStatus('on_the_way');
      }, 13000);

      const arrivedTimer = setTimeout(() => {
        setStatus('arrived');
      }, 20000);

      return () => {
        clearTimeout(acceptTimer);
        clearTimeout(onWayTimer);
        clearTimeout(arrivedTimer);
      };
    }, 100);

    return () => clearTimeout(initTimer);
  }, []);

  useEffect(() => {
    if (status === 'arrived') {
      const sliderTimer = setTimeout(() => {
        setShowSlider(true);
      }, 2000); // Reduced to 2 seconds for better UX
      return () => clearTimeout(sliderTimer);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'searching' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, timeLeft]);

  const getStatusIcon = () => {
    switch (status) {
      case 'searching':
        return <ActivityIndicator size="large" color="#f59e0b" />;
      case 'accepted':
        return <Ionicons name="checkmark-circle" size={56} color="#10b981" />;
      case 'on_the_way':
        return <Ionicons name="car" size={56} color="#3b82f6" />;
      case 'arrived':
        return <Ionicons name="flag" size={56} color="#10b981" />;
      default:
        return <ActivityIndicator size="large" color="#f59e0b" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'searching':
        return `Finding nearby mechanics... (${timeLeft}s)`;
      case 'accepted':
        return `${mechanicName} accepted your request`;
      case 'on_the_way':
        return `${mechanicName} is on the way to you`;
      case 'arrived':
        return `${mechanicName} has arrived at your location`;
      default:
        return 'Searching...';
    }
  };

  const getStatusSubText = () => {
    switch (status) {
      case 'searching':
        return 'Searching for available mechanics near you';
      case 'accepted':
        return `${mechanicName} is preparing to come to your location`;
      case 'on_the_way':
        return `${mechanicName} will reach you in approximately 10 minutes`;
      case 'arrived':
        return 'Please meet the mechanic at your vehicle location';
      default:
        return '';
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.replace('/(tabs)/home');
  };

  const mapRegion = {
    latitude: 17.385,
    longitude: 78.4867,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const translateX = pan.x;
  const thumbTranslate = translateX.interpolate({
    inputRange: [0, sliderWidth - THUMB_SIZE],
    outputRange: [0, sliderWidth - THUMB_SIZE],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tracking</Text>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        region={mapRegion}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{ latitude: 17.385, longitude: 78.4867 }}
          title="You"
          pinColor="red"
        />
        {status !== 'searching' && (
          <Marker
            coordinate={{ latitude: 17.392, longitude: 78.49 }}
            title={mechanicName || 'Mechanic'}
            pinColor="blue"
          />
        )}
      </MapView>

      <View style={styles.statusCard}>
        <View style={styles.statusIconContainer}>
          {getStatusIcon()}
        </View>
        
        <Text style={styles.statusText}>{getStatusText()}</Text>
        <Text style={styles.statusSubText}>{getStatusSubText()}</Text>

        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: status === 'searching' ? `${(10 - timeLeft) * 10}%` :
                       status === 'accepted' ? '33%' :
                       status === 'on_the_way' ? '66%' : '100%'
              }
            ]} 
          />
        </View>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={[styles.stepDot, status !== 'searching' && styles.stepDotActive]} />
            <Text style={[styles.stepText, status !== 'searching' && styles.stepTextActive]}>Finding</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <View style={[styles.stepDot, status === 'accepted' || status === 'on_the_way' || status === 'arrived' ? styles.stepDotActive : null]} />
            <Text style={[styles.stepText, status === 'accepted' || status === 'on_the_way' || status === 'arrived' ? styles.stepTextActive : null]}>Accepted</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <View style={[styles.stepDot, status === 'on_the_way' || status === 'arrived' ? styles.stepDotActive : null]} />
            <Text style={[styles.stepText, status === 'on_the_way' || status === 'arrived' ? styles.stepTextActive : null]}>On Way</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <View style={[styles.stepDot, status === 'arrived' && styles.stepDotActive]} />
            <Text style={[styles.stepText, status === 'arrived' && styles.stepTextActive]}>Arrived</Text>
          </View>
        </View>

        {problem && (
          <View style={styles.problemContainer}>
            <Text style={styles.problemLabel}>Your Problem:</Text>
            <Text style={styles.problemText}>{problem as string}</Text>
          </View>
        )}

        {/* Custom Uber/Swiggy Style Slider */}
        {showSlider && status === 'arrived' && (
          <View style={styles.sliderOuterContainer}>
            <View style={styles.priceDisplay}>
              <Text style={styles.priceLabel}>Total Amount</Text>
              <Text style={styles.priceAmount}>₹600</Text>
            </View>
            
            <View 
              style={styles.sliderTrack}
              onLayout={(e) => {
                const newWidth = e.nativeEvent.layout.width;
                setSliderWidth(newWidth);
              }}
            >
              <Animated.View 
                style={[
                  styles.sliderProgress,
                  {
                    width: translateX.interpolate({
                      inputRange: [0, sliderWidth - THUMB_SIZE],
                      outputRange: [0, sliderWidth - THUMB_SIZE],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              />
              
              <Animated.View
                style={[
                  styles.sliderThumb,
                  {
                    transform: [{ translateX: thumbTranslate }],
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <Ionicons 
                  name={isSlidingComplete ? "checkmark" : "arrow-forward"} 
                  size={28} 
                  color="#fff" 
                />
              </Animated.View>
              
              <Text style={styles.sliderText}>
                {isSlidingComplete ? 'Payment Complete!' : 'Slide to pay ₹600'}
              </Text>
            </View>
            
            <View style={styles.sliderFooter}>
              <Ionicons name="shield-checkmark" size={14} color="#10b981" />
              <Text style={styles.sliderFooterText}>Secure payment • 100% protected</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Ionicons name="home" size={20} color="#6b7280" />
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerPlaceholder: {
    width: 40,
  },
  map: {
    flex: 1,
  },
  statusCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  statusIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 8,
  },
  statusSubText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d1d5db',
    marginBottom: 6,
  },
  stepDotActive: {
    backgroundColor: '#10b981',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  stepText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  stepTextActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  problemContainer: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  problemLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  problemText: {
    fontSize: 14,
    color: '#1f2937',
  },
  sliderOuterContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  priceDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#059669',
  },
  sliderTrack: {
    width: '100%',
    height: TRACK_HEIGHT,
    backgroundColor: '#f1f5f9',
    borderRadius: 32,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  sliderProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#10b981',
    borderRadius: 32,
  },
  sliderThumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: '#10b981',
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    left: 4,
    top: 4,
  },
  sliderText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  sliderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  sliderFooterText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  homeButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});