import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'heading',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,

        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          android: {
            // Use a solid background on Android to prevent the ripple effect
            backgroundColor: 'rgb(0, 0, 0)',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Heading',
          tabBarIcon: () => <Feather name="compass" size={28} color="white" />,
        }}
      />
      <Tabs.Screen
        name="distance"
        options={{
          title: 'Distance',
          tabBarIcon: () => <Feather name="home" size={28} color="white" />,
        }}
      />
    </Tabs>
  );
}
