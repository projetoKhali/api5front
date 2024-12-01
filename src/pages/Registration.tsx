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
import { GroupAccess } from '../schemas/Group';
import { getGroupAccessList } from '../service/Group';

type User = {
  id: number;
  name: string;
  email: string;
  roles: number[]; // IDs dos Grupos de Permissão
};

type Group = {
  id: number;
  title: string;
};

const mockUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', roles: [1, 2] },
  { id: 2, name: 'Bob', email: 'bob@example.com', roles: [3] },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', roles: [4, 5] },
  { id: 4, name: 'DoBrow', email: 'dobrow@example.com', roles: [5, 8] },
  { id: 5, name: 'Macos', email: 'macos@example.com', roles: [7, 8] },
  { id: 6, name: 'Malaq', email: 'Malaq@example.com', roles: [2, 5] },
  { id: 7, name: 'Kurius', email: 'kurius@example.com', roles: [1, 7] },
  { id: 8, name: 'Nifix', email: 'nifix@example.com', roles: [1, 5, 7, 8] },
  { id: 3, name: 'Dom', email: 'dom@example.com', roles: [1, 2, 3, 4, 5, 6, 7, 8] },
];

const availableGroups: Group[] = [
  { id: 1, title: 'Khali' },
  { id: 2, title: 'Pixel' },
  { id: 3, title: 'Codecats' },
  { id: 4, title: 'Maqueb' },
  { id: 5, title: 'TechsLouques' },
  { id: 6, title: 'LigaWeb' },
  { id: 7, title: 'VivendoeCodando' },
  { id: 8, title: 'Vingacodes' },
];

const UserManagementScreen: React.FC = () => {
  const [groupAccessList, setGroupAccessList] = useState<GroupAccess[]>([]);

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchGroupAccess = async () => {
      try {
        const data = await getGroupAccessList();
        setGroupAccessList(data);
      } catch (error) {
        console.error('Erro ao carregar os grupos de acesso:', error);
      }
    };

    fetchGroupAccess();

  }, []);


  // Adicionar ou remover grupo
  const toggleGroup = (id: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((groupId) => groupId !== id) : [...prev, id]
    );
  };

  // Salvar ou atualizar o usuário
  const handleSaveUser = () => {
    if (!userName || !userEmail) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (selectedUser) {
      // Atualizar usuário existente
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, name: userName, email: userEmail, roles: selectedGroupIds }
          : user
      );
      setUsers(updatedUsers);
      Alert.alert('Sucesso', 'Usuário atualizado!');
    } else {
      // Criar novo usuário
      const newUser: User = {
        id: users.length + 1,
        name: userName,
        email: userEmail,
        roles: selectedGroupIds,
      };
      setUsers([...users, newUser]);
      Alert.alert('Sucesso', 'Usuário criado!');
    }

    clearForm();
  };

  const clearForm = () => {
    setUserName('');
    setUserEmail('');
    setSelectedGroupIds([]);
    setSelectedUser(null);
  };

  const renderGroup = ({ item }: { item: Group }) => {
    const isSelected = selectedGroupIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.groupItem, isSelected && styles.selectedGroup]}
        onPress={() => toggleGroup(item.id)}
      >
        <Text style={[styles.groupText, isSelected && styles.selectedGroupText]}>
          {item.title}
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
            value={userName}
            onChangeText={setUserName}
            placeholder="Nome do usuário"
          />
        </View>

        <View style={styles.emailContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder="Email do usuário"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.groupContainer}>
          <Text style={styles.label}>Grupos de Permissão</Text>
          <FlatList
            data={availableGroups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGroup}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.grid}
          />
        </View>

        <View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveUser}
          >
            <Text style={styles.buttonText}>
              {selectedUser ? 'Atualizar Usuário' : 'Criar Usuário'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      <View style={styles.tableContainer}>
        <DynamicTable tableData={groupAccessList.map(group => ({
          name: group.name,
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
});
