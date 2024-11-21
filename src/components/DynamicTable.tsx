import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, LayoutChangeEvent } from 'react-native';

type TableProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: Array<Record<string, any>>;
};

const DynamicTable = ({ tableData }: TableProps) => {
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
  const formatColumnName = (columnName: string) => {
    return columnName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };
  const formattedColumns = columns.map(col => formatColumnName(col));

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {formattedColumns.map((col, index) => (
        <Text key={index} style={[styles.headerCell, styles.column]}>
          {col}
        </Text>
      ))}
    </View>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRow = ({ item }: { item: Record<string, any> }) => (
    <View style={styles.row}>
      {columns.map((col, index) => (
        <Text key={index} style={[styles.cell]}>
          {typeof item[col] === 'number' ? item[col].toFixed(2) : item[col]}
        </Text>
      ))}
    </View>
  );

  return (
    <ScrollView horizontal style={styles.container}>
      <View style={styles.container}>
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
    display: "flex",
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: '0.5%'
  },
  body: {
    width: '200%',
    backgroundColor: 'white',
    height: '100%',
  },
  column: {
    minWidth: 160,
    height: '100%',
  },
  headerRow: {
    width: '200%',
    flexDirection: 'row',
    backgroundColor: '#FF8C00',
    padding: 10,
  },
  headerCell: {
    width: '200%',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#DCDADA',
    height: '100%',
  },
  cell: {
    width: '100%',
    textAlign: 'center',
    padding: 5,
    height: '100%',
  },
});

export default DynamicTable;
