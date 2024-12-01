import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Department, GroupAccess } from '../schemas/Group';
import { getDepartments } from '../service/Group';
import { getGroupAccessList } from '../service/Group';
import DynamicTable from '../components/DynamicTable';

const RolesManagementScreen: React.FC = () => {
  const [groupAccessList, setGroupAccessList] = useState<GroupAccess[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>([]); // Array de IDs selecionados

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchGroupAccess = async () => {
      try {
        const data = await getGroupAccessList();
        setGroupAccessList(data);
      } catch (error) {
        console.error('Erro ao carregar os grupos de acesso:', error);
      }
    };

    fetchGroupAccess();
    fetchDepartments();
  }, []);

  const handleSelectDepartment = (id: number) => {
    setSelectedDepartmentIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((item) => item !== id) : [...prevIds, id]
    );
  };

  const renderDepartment = ({ item }: { item: Department }) => {
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
            onPress={() => {
              console.log('Departamentos selecionados:', selectedDepartmentIds);
            }}
          >
            <Text style={styles.buttonText}>Salvar</Text>
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
    height: '43%',
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
    height: '60%',
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
    height: '45%',
    width: '85%',
  },
});
