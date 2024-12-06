import { Magnetometer, MagnetometerMeasurement } from 'expo-sensors';
import LPF from 'lpf';
import { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
const { height, width } = Dimensions.get('window');

const getDirection = (degrees: number): string => {
  if (degrees >= 337.5 || degrees < 22.5) return 'N';
  if (degrees >= 22.5 && degrees < 67.5) return 'NE';
  if (degrees >= 67.5 && degrees < 112.5) return 'E';
  if (degrees >= 112.5 && degrees < 157.5) return 'SE';
  if (degrees >= 157.5 && degrees < 202.5) return 'S';
  if (degrees >= 202.5 && degrees < 247.5) return 'SW';
  if (degrees >= 247.5 && degrees < 292.5) return 'W';
  if (degrees >= 292.5 && degrees < 337.5) return 'NW';
  return '';
};

const compensateDeviceState = (degrees: number) => {
  //compensate the device positin
  degrees -= 90;
  if (degrees < 0) {
    degrees += 360;
  } else if (degrees >= 360) {
    degrees -= 360;
  }
  return degrees;
};

const rotateValue = new Animated.Value(0);

export default function TabTwoScreen() {
  const [magneticField, setMagneticField] = useState({ x: 0, y: 0, z: 0 });
  const [heading, setHeading] = useState(0);
  const [headingString, setHeadingString] = useState('N');

  Magnetometer.addListener((magneticField: MagnetometerMeasurement) => {
    setMagneticField(magneticField);
  });
  Magnetometer.setUpdateInterval(200); // 1 will be optimal

  useEffect(() => {
    // Calculate heading
    let angle = Math.atan2(magneticField.y, magneticField.x) * (180 / Math.PI);
    if (angle < 0) {
      angle += 360;
    }

    const correctedAngle = compensateDeviceState(Math.round(LPF.next(angle)));
    const direction = getDirection(correctedAngle);
    if (direction !== undefined) {
      setHeadingString(`${correctedAngle.toFixed(2)}° ${direction}`);
      setHeading(correctedAngle);
    }
  }, [magneticField]);

  useEffect(() => {
    // Rotate the compass image
    Animated.timing(rotateValue, {
      toValue: heading,
      duration: 1,
      useNativeDriver: true,
    }).start();

    return () => {
      Magnetometer.removeAllListeners();
    };
  }, []);

  const rotateStyle = {
    transform: [{ rotate: `${270 - heading}deg` }],
  };

  return (
    <ScrollView
      style={{
        backgroundColor: '#f5f5f5',
      }}
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={styles.container}>
        <View style={{ width: width, alignItems: 'center', bottom: -90 }}>
          <Image
            source={require('../../assets/compass_pointer.png')}
            style={{
              height: height / 26,
              resizeMode: 'contain',
            }}
          />
        </View>
        <View style={styles.compassContainer}>
          <Animated.Image
            source={require('../../assets/compass_bg.png')}
            style={[styles.compassImage, rotateStyle]}
          />
        </View>
        <Text
          style={styles.cardinalDirection}
        >{`Direction: ${headingString}`}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  compassContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 125,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  compassImage: {
    width: 300,
    height: 300,
  },
  headingValue: {
    fontSize: 18,
    marginTop: 10,
    color: '#555',
  },
  cardinalDirection: {
    fontSize: 18,
    marginTop: 50,
    color: '#555',
  },
});
