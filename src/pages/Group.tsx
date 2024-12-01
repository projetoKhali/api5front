import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DynamicTable from '../components/DynamicTable';

type Group = {
  name: string;
  departments: string[];
  actions: JSX.Element;
};

const fetchGroups = async () => [
  {
    id: 1,
    name: 'ADM',
    departments: ['Marketing', 'Rh', 'CX', 'CEO', 'Comer'],
  },
  {
    id: 2,
    name: 'RH',
    departments: ['Marketing', 'Rh'],
  },
  {
    id: 3,
    name: 'Marketing',
    departments: ['Marketing'],
  },
  {
    id: 4,
    name: 'Tech',
    departments: ['Marketing', 'Rh', 'CX', 'CEO', 'Comer'],
  },
];

const RolesManagementScreen: React.FC = () => {
  const [data, setData] = useState<Group[] | null>(null);
  const [departments, setDepartments] = useState<string[]>(['Marketing', 'Rh', 'CX', 'CEO', 'Comer']);
  const [groupName, setGroupName] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Funções de ação para os botões
  const handleEdit = (groupName: string) => {
    Alert.alert('Editar Grupo', `Você clicou em editar o grupo: ${groupName}`);
  };

  const handleDelete = (groupName: string) => {
    Alert.alert(
      'Excluir Grupo',
      `Você deseja realmente excluir o grupo: ${groupName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => console.log(`Grupo ${groupName} excluído`) },
      ],
      { cancelable: true }
    );
  };

  const transformData = (groups: any[]): Group[] =>
    groups.map((group) => ({
      name: group.name,
      departments: group.departments.join(', '),
      actions: (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(group.name)}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(group.name)}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      ),
    }));

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await fetchGroups();
      const transformedData = transformData(apiData);
      setData(transformedData);
    };

    fetchData();
  }, []);

  // Função para alternar a seleção de departamentos
  const toggleDepartmentSelection = (department: string) => {
    setSelectedDepartments(prevState => {
      if (prevState.includes(department)) {
        return prevState.filter(item => item !== department); // Desmarcar
      } else {
        return [...prevState, department]; // Marcar
      }
    });
  };

  // Renderiza a tabela de dados existentes
  const renderTable = () => {
    if (!data || data.length === 0) {
      return <Text style={styles.noDataText}>Nenhum dado disponível</Text>;
    }

    return <DynamicTable tableData={data} />;
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
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Nome do Grupo"
          />
        </View>

        <View style={styles.departmentContainer}>
          <Text style={styles.label}>Departamentos</Text>
          <FlatList
            data={departments}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.departmentItem}>
                <Text>{item}</Text>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    selectedDepartments.includes(item) && styles.selectedCheckbox,
                  ]}
                  onPress={() => toggleDepartmentSelection(item)}
                >
                  {selectedDepartments.includes(item) ? (
                    <Text style={styles.selectedText}>✓</Text>
                  ) : (
                    <Text style={styles.unselectedText}>□</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}/>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Salvar" onPress={() => { }}/>
        </View>

      </View>

      <View style={styles.tableContainer}>{renderTable()}</View>

    </View>
  );
};

export default RolesManagementScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#DCDADA',
    alignItems: 'center',
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
  form: {
    height:'43%',
    flexDirection: 'column'
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  departmentContainer: {
  },
  buttonContainer: {
    height:'10%',
  },
  tableContainer: {
    height: '50%',
    paddingVertical: 20,
  },

  title: {
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 8,
    marginLeft: 8,
    flex: 1,
    backgroundColor: '#fff',
  },
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#007bff',
  },
  selectedCheckbox: {
    backgroundColor: '#007bff',
  },
  selectedText: {
    color: '#fff',
    fontSize: 16,
  },
  unselectedText: {
    color: '#007bff',
    fontSize: 16,
  },
  
  noDataText: {
    textAlign: 'center',
    color: '#6c757d',
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
  },
});
