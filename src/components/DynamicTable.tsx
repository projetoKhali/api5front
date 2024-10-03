import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';

type TableProps = {
    tableData: Array<Record<string, any>>;
};

const DynamicTable: React.FC<TableProps> = ({ tableData }) => {

    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const formatColumnName = (columnName: string) => {
        return columnName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };
    const formattedColumns = columns.map((col) => formatColumnName(col));

    const renderHeader = () => (
        <View style={styles.headerRow}>
            {formattedColumns.map((col, index) => (
                <Text key={index} style={[styles.headerCell, styles.column, ]}>
                    {col}
                </Text>
            ))}
        </View>
    );
    const renderRow = ({ item }: { item: Record<string, any> }) => (
        <View style={styles.row}>
            {columns.map((col, index) => (
                <Text key={index} style={[styles.cell]}>
                    {item[col]}
                </Text>
            ))}
        </View>
    );

    return (
        <ScrollView  horizontal style={styles.container}>
            <View>
                {renderHeader()}
                <View style={styles.body}>
                    <FlatList
                        data={tableData}
                        renderItem={renderRow}
                        keyExtractor={(_, index) => index.toString()}
                    />
                </View>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    body: {
        maxHeight: 200,
        width: '100%',
        backgroundColor: 'white',
    },
    column: {
        minWidth: 160,
    },
    headerRow: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#FF8C00',
        padding: 10,
    },
    headerCell: {
        width: '100%',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    row: {
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#DCDADA',
    },
    cell: {
        width: '100%',
        textAlign: 'center',
        padding: 5,
    },
});

export default DynamicTable;
