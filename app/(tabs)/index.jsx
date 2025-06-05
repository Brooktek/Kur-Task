import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import TaskList from '../../components/TaskList';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'

  // Animation values for filter buttons
  const scaleAll = useSharedValue(1);
  const scalePending = useSharedValue(1);
  const scaleCompleted = useSharedValue(1);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const toggleTask = async (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = async (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Animation handler for filter buttons
  const handlePress = (filterType, scale) => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
      setFilter(filterType);
    });
  };

  // Animated styles for filter buttons
  const animatedStyleAll = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAll.value }],
  }));
  const animatedStylePending = useAnimatedStyle(() => ({
    transform: [{ scale: scalePending.value }],
  }));
  const animatedStyleCompleted = useAnimatedStyle(() => ({
    transform: [{ scale: scaleCompleted.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Todo List</Text>
        <Text style={styles.subtitle}>
          {filteredTasks.length} {filter === 'all' ? 'Tasks' : filter === 'completed' ? 'Completed' : 'Pending'}
        </Text>
      </View>
      <View style={styles.filterContainer}>
        <Animated.View style={[animatedStyleAll]}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => handlePress('all', scaleAll)}
            activeOpacity={0.8}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[animatedStylePending]}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
            onPress={() => handlePress('pending', scalePending)}
            activeOpacity={0.8}
          >
            <Text style={styles.filterText}>Pending</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[animatedStyleCompleted]}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
            onPress={() => handlePress('completed', scaleCompleted)}
            activeOpacity={0.8}
          >
            <Text style={styles.filterText}>Completed</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome name="inbox" size={48} color="#6200ea" />
          <Text style={styles.emptyText}>
            {filter === 'all' ? 'No tasks yet!' : filter === 'completed' ? 'No completed tasks!' : 'No pending tasks!'}
          </Text>
          <Text style={styles.emptySubText}>Add a task to get started.</Text>
        </View>
      ) : (
        <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20, // Adjust for safe area
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6200ea',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#6200ea',
    shadowOpacity: 0.2,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  emptySubText: {
    fontSize: 14,
    color: '#6b7280',
  },
});