import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function TaskItem({ task, onToggle, onDelete }) {
  const scaleToggle = useSharedValue(1);
  const scaleDelete = useSharedValue(1);

  const handleTogglePress = () => {
    scaleToggle.value = withSpring(0.95, {}, () => {
      scaleToggle.value = withSpring(1);
      onToggle(task.id);
    });
  };

  const handleDeletePress = () => {
    scaleDelete.value = withSpring(0.95, {}, () => {
      scaleDelete.value = withSpring(1);
      onDelete(task.id);
    });
  };

  const animatedStyleToggle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleToggle.value }],
  }));
  const animatedStyleDelete = useAnimatedStyle(() => ({
    transform: [{ scale: scaleDelete.value }],
  }));

  return (
    <View style={styles.taskContainer}>
      <Animated.View style={[animatedStyleToggle]}>
        <TouchableOpacity onPress={handleTogglePress} activeOpacity={0.8}>
          <FontAwesome
            name={task.completed ? 'check-circle' : 'circle-o'}
            size={24}
            color={task.completed ? '#4caf50' : '#6200ea'}
          />
        </TouchableOpacity>
      </Animated.View>
      <Text style={[styles.taskText, task.completed && styles.completed]}>
        {task.title}
      </Text>
      <Animated.View style={[animatedStyleDelete]}>
        <TouchableOpacity onPress={handleDeletePress} activeOpacity={0.8}>
          <FontAwesome name="trash" size={24} color="#f44336" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    color: '#374151',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
});