import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Suggestion } from '../schemas/Suggestion';
import { FlatList } from 'react-native-gesture-handler';

type MultiselectFilterProps = {
  placeholder: string;
  options: Suggestion[];
  onChange: (option: Suggestion) => void;
};

export default function MultiselectFilter({
  placeholder,
  options,
  onChange,
}: MultiselectFilterProps) {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<Suggestion | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(options);
  const [isListOpen, setIsListOpen] = useState<boolean>(false);

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    updateSuggestions(text);
  };

  const updateSuggestions = (text: string) => {
    setSuggestions(
      options.filter(option =>
        option.title.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  const handleOptionChange = (option: Suggestion) => {
    setSuggestions([]);
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <>
      <View>
        <FlatList
          style={styles.suggestionsList}
          ListHeaderComponent={
            <TextInput
              placeholder={placeholder}
              value={selectedOption ? selectedOption.title : (searchText ?? '')}
              onChangeText={handleSearchTextChange}
              onFocus={() => setIsListOpen(true)}
              onBlur={() => setIsListOpen(false)}
            />
          }
          data={isListOpen ? suggestions : []}
          keyExtractor={item => `${item.id}`}
          renderItem={({ item }) => (
            <Pressable
              key={item.id}
              // className="lookuptextfield-suggestion"
              onPress={() => {
                handleOptionChange(item);
              }}
            >
              {item.title}
            </Pressable>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  suggestionsList: {
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: 'white',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    borderRadius: 4,
  },
});
