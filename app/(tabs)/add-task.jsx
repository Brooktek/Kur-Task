import { View, StyleSheet } from 'react-native';
import AddTaskForm from '../../components/AddTaskForm';

export default function AddTaskScreen() {
  return (
    <View style={styles.container}>
      <AddTaskForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});