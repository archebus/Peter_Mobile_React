import { View, Text, Pressable } from 'react-native';
import styles from '../../styles.json';

const List = props => (
  <View>
    {props.users.map(u => (
      <View key={u.id} style={styles.userContainer}>
        <Text>{u.name} {u.age}</Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={() => props.actions.selectUser(u, 'edit')}>
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => props.actions.getUserDetails(u.id)}>
            <Text style={styles.buttonText}>Get Details</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => props.actions.deleteUser(u.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    ))}
  </View>
);

export default List;