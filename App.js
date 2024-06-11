import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import styles from './styles.json';
import List from './components/user/List.jsx';
import Details from './components/user/Details.jsx';

export default function App() {
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState("list");

  useEffect(() => {
    fetch("http://localhost:3000/people")
      .then(r => r.json())
      .then(j => setUsers(j))
      .catch(e => console.error(JSON.stringify(e)))
      .finally(() => setIsLoading(false));
  }, []);

  const actions = {
    showLoader: () => setIsLoading(true),
    hideLoader: () => setIsLoading(false),
    showList: () => setMode('list'),
    addUser: u => { setUsers([...users, u]); setMode('list'); },
    selectUser: (u, m) => { setUser(u); setMode(m); },
    mode,
    isEdit: mode === 'edit' && user,
    updateUser: u => { setUsers(users.map(us => u.id === us.id ? u : us)); setMode('list'); },
    getUserDetails: id => {
      fetch(`http://localhost:3000/people/${id}`)
        .then(r => r.json())
        .then(u => setUser(u))
        .catch(e => console.error(e.message))
        .finally(() => setMode('details'));
    },
    deleteUser: id => {
      actions.showLoader();
      fetch(`http://localhost:3000/people/${id}`, { method: "DELETE" })
        .then(() => setUsers(users.filter(user => user.id !== id)))
        .catch(e => console.error(e.message))
        .finally(() => actions.hideLoader());
    }
  };

  if (isLoading) {
    return <View style={styles.border}><Text>Loading..................... : ) ..</Text></View>;
  }

  return (
    <View style={{ ...styles.border, borderColor: 'white' }}>
      <Image
        source={require('./images/logo.png')}
        style={{ width: 200, height: 200, alignSelf: 'center', marginBottom: 20 }}
      />
      <View>
        {mode === 'list' && (
          <View>
            <Pressable style={styles.button} onPress={() => setMode('create')}>
              <Text style={styles.buttonText}>Add user</Text>
            </Pressable>
            <List users={users} actions={actions} />
          </View>
        )}
        {mode === 'create' && <Form actions={actions} />}
        {mode === 'edit' && <Form actions={actions} user={user} />}
        {mode === 'details' && <Details user={user} actions={actions} />}
      </View>
    </View>
  );
}

function Form(props) {
  let actions = props.actions;
  const [name, setName] = useState(actions.isEdit ? props.user.name : "");
  const [age, setAge] = useState(actions.isEdit ? props.user.age : "");
  const [email, setEmail] = useState(actions.isEdit ? props.user.email : "");
  const [address, setAddress] = useState(actions.isEdit ? props.user.address : "");

  const postUser = () => {
    actions.showLoader();
    fetch("http://localhost:3000/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age, email, address })
    })
      .then(r => r.json())
      .then(j => actions.addUser(j))
      .catch(e => console.error(e.message))
      .finally(() => actions.hideLoader());
  };

  const putUser = () => {
    actions.showLoader();
    fetch("http://localhost:3000/people/" + props.user?.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.user?.id, name, age, email, address })
    })
      .then(r => r.json())
      .then(j => actions.updateUser(j))
      .catch(e => console.error(e.message))
      .finally(() => actions.hideLoader());
  };

  return (
    <View style={{ width: '100%' }}>
      <Pressable onPress={() => actions.showList()} style={styles.border}>
        <Text style={styles.text}>Close</Text>
      </Pressable>
      <View><Text style={styles.text}>{actions.mode}</Text></View>
      <View>
        <Text style={styles.text}>Name: </Text>
        <TextInput value={name} onChangeText={setName} style={styles.border} />
      </View>
      <View>
        <Text style={styles.text}>Age: </Text>
        <TextInput value={age} onChangeText={setAge} style={styles.border} />
      </View>
      <View>
        <Text style={styles.text}>Email: </Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.border} />
      </View>
      <View>
        <Text style={styles.text}>Address: </Text>
        <TextInput value={address} onChangeText={setAddress} style={styles.border} />
      </View>
      <Pressable onPress={actions.isEdit ? putUser : postUser} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </View>
  );
}