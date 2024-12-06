import { ScrollView, StyleSheet } from 'react-native';

import MotionTracking from '@/components/AcceleretometerDistance';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.titleContainer}>
        <MotionTracking />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
