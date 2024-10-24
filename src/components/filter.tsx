import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type FilterProps = {
  placeholder: string;
  onChange: (text: string) => void;
  type: 'text' | 'date';
};

const Filter = ({ placeholder, onChange, type }: FilterProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [text, setText] = useState<string>('');

  const handleDateChange = (date: Date | null) => {
    setDate(date);
    onChange(date ? date.toISOString().split('T')[0] : '');
  };

  if (type === 'date') {
    return (
      <View style={styles.container}>
        <View style={styles.datePickerContainer}>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText={placeholder}
            className="react-datepicker-wrapper"
            wrapperClassName="react-datepicker-container"
            popperClassName="react-datepicker-popper"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={text}
        onChangeText={text => {
          setText(text);
          onChange(text);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: '20%',
    paddingHorizontal: 10,
    minWidth: 300,
  },
  input: {
    height: 32,
    borderColor: '#ddd',
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 14,
    alignContent: 'center',
    color: '#515151',
  },
  datePickerContainer: {
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 32,
    color: '#3c3c3c',
  },
});

export default Filter;
