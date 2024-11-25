// @ts-nocheck 

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const MotionTracking = () => {
  const [distance, setDistance] = useState(0);
  const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [recentAccelerations, setRecentAccelerations] = useState([]);
  const STATIONARY_THRESHOLD = 0.2; // Threshold to detect stationary state
  const ACCEL_GRAVITY = 9.81; // Gravity constant to remove gravity

  const ACCEL_UPDATE_INTERVAL = 16; // Update interval ~60Hz
  const STATIONARY_WINDOW = 10; // Number of samples to check for stationary state
  const VELOCITY_DECAY = 0.9; // Decay factor for velocity when stationary

  useEffect(() => {
    const subscription = Accelerometer.addListener(handleAccelerometerUpdate);
    Accelerometer.setUpdateInterval(ACCEL_UPDATE_INTERVAL);

    return () => subscription.remove();
  }, [lastUpdate, velocity, recentAccelerations]);

  const handleAccelerometerUpdate = (accelerometerData) => {
    const currentTime = Date.now();
    const deltaTime = lastUpdate ? (currentTime - lastUpdate) / 1000 : 0;

    const correctedAcceleration = {
      x: accelerometerData.x * ACCEL_GRAVITY,
      y: accelerometerData.y * ACCEL_GRAVITY,
      z: (accelerometerData.z - 1) * ACCEL_GRAVITY,
    };

    setRecentAccelerations((prev) => {
      const newAccelerations = [...prev, correctedAcceleration].slice(-STATIONARY_WINDOW);
      const stationary = isDeviceStationary(newAccelerations);
      setIsMoving(!stationary);

      if (stationary) {
        // Decay velocity when stationary
        setVelocity((prevVelocity) => ({
          x: prevVelocity.x * VELOCITY_DECAY,
          y: prevVelocity.y * VELOCITY_DECAY,
          z: prevVelocity.z * VELOCITY_DECAY,
        }));
      } else {
        // Update motion when moving
        updateMotion(correctedAcceleration, deltaTime);
      }

      return newAccelerations;
    });

    setLastUpdate(currentTime);
  };

  const isDeviceStationary = (accelerations) => {
    if (accelerations.length < STATIONARY_WINDOW) return true;

    const avgMagnitude = accelerations.reduce((sum, acc) => {
      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      return sum + magnitude;
    }, 0) / accelerations.length;

    return avgMagnitude < STATIONARY_THRESHOLD;
  };

  const updateMotion = (acceleration, deltaTime) => {
    setVelocity((prevVelocity) => {
      const newVelocity = {
        x: prevVelocity.x + acceleration.x * deltaTime,
        y: prevVelocity.y + acceleration.y * deltaTime,
        z: prevVelocity.z + acceleration.z * deltaTime,
      };

      const deltaDistance = calculateDistance(prevVelocity, newVelocity, deltaTime);

      setDistance((prevDistance) => prevDistance + deltaDistance);

      return newVelocity;
    });
  };

  const calculateDistance = (prevVelocity, newVelocity, deltaTime) => {
    return (
      0.5 *
      deltaTime *
      Math.sqrt(
        (prevVelocity.x + newVelocity.x) ** 2 +
          (prevVelocity.y + newVelocity.y) ** 2 +
          (prevVelocity.z + newVelocity.z) ** 2
      )
    );
  };

  const resetTracking = () => {
    setDistance(0);
    setVelocity({ x: 0, y: 0, z: 0 });
    setRecentAccelerations([]);
    setIsMoving(false);
    setLastUpdate(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Distance: {distance.toFixed(2)} meters</Text>
      <Text style={styles.text}>Status: {isMoving ? 'Moving' : 'Stationary'}</Text>
      <Button title="Reset Tracking" onPress={resetTracking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
});

export default MotionTracking;

