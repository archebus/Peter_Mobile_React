import { View, Text, Pressable } from 'react-native';
import styles from '../../styles.json';

function Details({ user, actions }) {
    if (!user) return null;
  
    return (
      <View style={{ ...styles.border, borderColor: 'white' }}>
        <Text style={styles.header}>User Details</Text>
        <Text>Name: {user.name}</Text>
        <Text>Age: {user.age}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Address: {user.address}</Text>
        <Pressable style={styles.button} onPress={() => actions.showList()}>
          <Text style={styles.buttonText}>Back to List</Text>
        </Pressable>
      </View>
    );
  }

  export default Details;