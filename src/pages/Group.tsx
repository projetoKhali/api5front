import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  AccessGroupSchema,
  CreateAccessGroupSchema,
} from '../schemas/AccessGroup';
import { getAccessGroupes, createAccessGroup } from '../service/AccessGroup';
import DynamicTable from '../components/DynamicTable';
import { Suggestion } from '../schemas/Misc';
import { getSuggestionsDepartment } from '../service/Suggestions';

const RolesManagementScreen: React.FC = () => {
  const [accessGroupList, setAccessGroupList] = useState<AccessGroupSchema[]>([]);
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

    const fetchAccessGroup = async () => {
      try {
        const data = await getAccessGroupes();
        setAccessGroupList(data);
      } catch (error) {
        console.error('Erro ao carregar os grupos de acesso:', error);
      }
    };

    fetchAccessGroup();
    fetchDepartments();
  }, []);

  const handleSave = async () => {
    if (!groupName || selectedDepartmentIds.length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const body: CreateAccessGroupSchema = {
      name: groupName,
      departments: selectedDepartmentIds,
    };

    try {
      const response = await createAccessGroup(body);
      Alert.alert('Sucesso', `Grupo ${response.name} criado com sucesso!`);
      setGroupName('');
      setSelectedDepartmentIds([]);
      const updatedGroups = await getAccessGroupes();
      setAccessGroupList(updatedGroups);
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      Alert.alert('Erro', 'Falha ao criar o grupo.');
    }
  };

  const handleSelectDepartment = (id: number) => {
    setSelectedDepartmentIds(prevIds =>
      prevIds.includes(id)
        ? prevIds.filter(item => item !== id)
        : [...prevIds, id],
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
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <View style={styles.nameContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome do Grupo"
              onChangeText={setGroupName}
              value={groupName}
            />
          </View>

          <View style={styles.departmentContainer}>
            <Text style={styles.label}>Departamentos</Text>
            <FlatList
              data={departments}
              renderItem={renderDepartment}
              keyExtractor={item => item.id.toString()}
              numColumns={4}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.grid}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cont}>
      <View style={styles.tableContainer}>
        <DynamicTable
          tableData={accessGroupList.map(group => ({
            name: group.name,
            departments:
              group.departments?.map(item => item.title).join(',') || '',
          }))}
        />
      </View>
      </View>
    </View>
  );
};

export default RolesManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15
  },
  titleHeader: {
    backgroundColor: '#EDE7E7',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  form: {
    marginBottom: 15,
  },
  nameContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  departmentContainer: {
    marginBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  grid: {
    marginBottom: 10,
  },
  card: {
    flexBasis: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#FF8C00',
    borderColor: 'white',
  },
  cardText: {
    color: '#333',
    fontSize: 16,
  },
  selectedCardText: {
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    alignItems: 'center',
    maxHeight: 400,
    height: '100%',
    width: '36.5%',
  },
  cont:{
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  }
});
