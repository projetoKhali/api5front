import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DynamicTable from '../components/DynamicTable';
import { CreateUserSchema, UserSchema } from '../schemas/User';
import { createUser, getUsers } from '../service/User';
import { AccessGroupSchema } from '../schemas/AccessGroup';
import { getAccessGroupes } from '../service/AccessGroup';

const UserManagementScreen: React.FC = () => {
  const [accessGroupList, setAccessGroupList] = useState<AccessGroupSchema[]>([]);
  const [userList, setUserList] = useState<UserSchema[]>([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId(prevId => (prevId === id ? null : id));
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
      groupId: selectedGroupId,
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
        const groups = await getAccessGroupes();
        setAccessGroupList(groups);
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUserList(users);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchGroups();
    fetchUsers();
  }, []);

  const renderGroups = ({ item }: { item: AccessGroupSchema }) => {
    const isSelected = selectedGroupId === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => handleSelectGroup(item.id)}
      >
        <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>
          {item.name}
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do usuário"
            onChangeText={setUserName}
            value={userName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email do usuário"
            keyboardType="email-address"
            onChangeText={setUserEmail}
            value={userEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
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
            data={accessGroupList}
            renderItem={renderGroups}
            keyExtractor={item => item.id.toString()}
            numColumns={5} // Alterado para 2 colunas para melhor distribuição
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.grid}
          />
        </View>

        <View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <DynamicTable
          tableData={userList.map(user => ({
            name: user.name,
            email: user.email,
            groupId: user.group,
          }))}
        />
      </View>
    </View>
  );
};

export default UserManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 16,
    justifyContent: 'flex-start',
  },
  titleHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  groupContainer: {
    marginBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Melhor espaçamento entre as colunas
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Ajusta o espaço entre as células
  },
  card: {
    flexBasis: '48%', // Ajusta o tamanho para 2 colunas
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedCard: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  cardText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedCardText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 20,
    alignItems: 'center',
    height: '30%',
  },
});
