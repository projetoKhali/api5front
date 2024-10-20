import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, LayoutChangeEvent } from 'react-native';

type TableProps = {
    tableData: Array<Record<string, any>>;
};

const DynamicTable: React.FC<TableProps> = ({ tableData }) => {
    const [tableWidth, setTableWidth] = useState<number>(0);
    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const columnWidth = tableWidth / columns.length || 1;

    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setTableWidth(width);
    }, []);
    
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
                <Text key={index} style={[styles.headerCell, { width: columnWidth }]}>
                    {col}
                </Text>
            ))}
        </View>
    );
    const renderRow = ({ item }: { item: Record<string, any> }) => (
        <View style={styles.row}>
            {columns.map((col, index) => (
                <Text key={index} style={[styles.cell, { width: columnWidth }]}>
                    {item[col]}
                </Text>
            ))}
        </View>
    );

    return (
        <ScrollView horizontal style={styles.container} onLayout={handleLayout}>
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
        width:'100%',
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
