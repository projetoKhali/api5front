import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { GroupAccessSchema, CreateGroupAccessSchema, CreateGroupAccessResponse } from '../schemas/GroupAccess';
import { getGroupAccesses, createGroupAccess  } from '../service/GroupAccess';
import DynamicTable from '../components/DynamicTable';
import { Suggestion } from '../schemas/Suggestion';
import { getSuggestionsDepartment } from '../service/Suggestions';

const RolesManagementScreen: React.FC = () => {
  const [groupAccessList, setGroupAccessList] = useState<GroupAccessSchema[]>([]);
  const [groupName, setGroupName] = useState('');
  const [departments, setDepartments] = useState<Suggestion[]>([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>([]); 

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getSuggestionsDepartment();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchGroupAccess = async () => {
      try {
        const data = await getGroupAccesses();
        setGroupAccessList(data);
      } catch (error) {
        console.error('Erro ao carregar os grupos de acesso:', error);
      }
    };

    fetchGroupAccess();
    fetchDepartments();
  }, []);

  const handleSave = async () => {
    if (!groupName || selectedDepartmentIds.length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const body: CreateGroupAccessSchema = {
      name: groupName,
      departments: selectedDepartmentIds,
    };

    try {
      const response = await createGroupAccess(body);
      Alert.alert('Sucesso', `Grupo ${response.name} criado com sucesso!`);
      setGroupName('');
      setSelectedDepartmentIds([]);
      const updatedGroups = await getGroupAccesses();
      setGroupAccessList(updatedGroups);
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      Alert.alert('Erro', 'Falha ao criar o grupo.');
    }
  };


  const handleSelectDepartment = (id: number) => {
    setSelectedDepartmentIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((item) => item !== id) : [...prevIds, id]
    );
  };

  const renderDepartment = ({ item }: { item: Suggestion }) => {
    const isSelected = selectedDepartmentIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => handleSelectDepartment(item.id)}
      >
        <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleHeader}>
        <Text style={styles.title}>Gerenciamento de Grupo</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.nameContainer}>
          <Text style={styles.label}>Nome do Grupo</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Grupo"
            onChangeText={setGroupName}
            value= {groupName}
          />
        </View>

        <View style={styles.departmentContainer}>
          <Text style={styles.label}>Departamentos</Text>
          <FlatList
            data={departments}
            renderItem={renderDepartment}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
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
        <DynamicTable tableData={groupAccessList.map(group => ({
          name: group.name,
          departments: group.departments?.map((item) => item.title).join(',') || '',
        }))} />
      </View>
      
    </View>
  );
};

export default RolesManagementScreen;

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
    height: '33%',
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
  departmentContainer: {
    marginLeft: '3%',
    marginBottom: 10,
    height: '30%',
  },
  columnWrapper: {
    justifyContent: 'center',
    marginBottom: 10,
  },
  grid: {
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
    maxHeight: 300,
    height: '50%',
    width: '85%',
  },
});
