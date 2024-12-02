import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import DynamicTable from '../components/DynamicTable';
import { User } from '../schemas/Login';
import { CreateUserSchema, UserSchema } from '../schemas/User';
import { createUser, getUsers } from '../service/User';
import { CreateGroupAccessResponse, GroupAccessSchema } from '../schemas/GroupAccess';
import { Suggestion } from '../schemas/Suggestion';
import { getGroupAccesses } from '../service/GroupAccess';


const UserManagementScreen: React.FC = () => {

  const [groupAccessList, setGroupAccessList] = useState<GroupAccessSchema[]>([]);
  const [userList, setUserList] = useState<UserSchema[]>([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId((prevId) => (prevId === id ? null : id));
  };

  const handleSave = async () => {
    if (!userName || !userEmail || selectedGroupId === null) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const body: CreateUserSchema = {
      name: userName,
      email: userEmail,
      password: userPassword,
      groupId: selectedGroupId
    };

    try {
      const response = await createUser(body);
      Alert.alert('Sucesso', `Usuário ${response.name} criado com sucesso!`);
      setUserName('');
      setUserEmail('');
      setUserPassword('');
      setSelectedGroupId(null);

      const updatedUsers = await getUsers();
      setUserList(updatedUsers);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      Alert.alert('Erro', 'Falha ao criar o usuário.');
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await getGroupAccesses(); 
        setGroupAccessList(groups);
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUserList(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchGroups();
    fetchUsers();
  }, []);

  const renderGroups = ({ item }: { item: GroupAccessSchema }) => {
    const isSelected = selectedGroupId === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => handleSelectGroup(item.id)}
      >
        <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>
          {item.name  }
        </Text>
      </TouchableOpacity>
    );
  };



  return (
    <View style={styles.container}>
      <View style={styles.titleHeader}>
        <Text style={styles.title}>Gerenciamento de Usuários</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.nameContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do usuário"
            onChangeText={setUserName}
            value={userName}
          />
        </View>

        <View style={styles.emailContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email do usuário"
            keyboardType="email-address"
            onChangeText={setUserEmail}
            value={userEmail}
          />
        </View>

        <View style={styles.passwordContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha do usuário"
            onChangeText={setUserPassword}
            value={userPassword}
          />
        </View>

        <View style={styles.groupContainer}>
          <Text style={styles.label}>Grupos de Permissão</Text>
          <FlatList
            data={groupAccessList}
            renderItem={renderGroups}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.grid}
          />
        </View>

        <View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

      </View>

      <View style={styles.tableContainer}>
        <DynamicTable tableData={userList.map(user => ({
          name: user.name,
          email: user.email,
          groupId: user.group,
          }))} />
      </View>

    </View>
  );
};

export default UserManagementScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#DCDADA',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  titleHeader: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#EDE7E7',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '7%',
  },
  title: {
    fontSize: 20,
  },
  form: {
    height: '40%',
    width: '100%',
    flexDirection: 'column',
  },
  nameContainer: {
    marginLeft: '3%',
    height: '20%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    paddingRight: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 8,
    width: '30%',
    backgroundColor: '#fff',
  },
  emailContainer: {
    marginLeft: '3%',
    height: '20%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordContainer:{
    marginLeft: '3%',
    height: '20%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupContainer: {
    marginLeft: '3%',
    marginBottom: 10,
    height: '40%',
  },
  groupItem: {
    flexBasis: '18.5%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  columnWrapper: {
    justifyContent: 'center',
    marginBottom: 10,
  },
  grid: {
  },


  selectedGroup: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  groupText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedGroupText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  tableContainer: {
    alignItems: 'center',
    height: '35%',
    width: '85%',
  },

  card: {
    flexBasis: '18.5%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCard: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  cardText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedCardText: {
    color: 'white',
  },
});
