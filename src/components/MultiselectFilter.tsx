import React, { useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, TextInput, Pressable, Dimensions } from 'react-native';
import { Suggestion } from '../schemas/Suggestion';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

type ListOperation = 'ADDED' | 'REMOVED';

type MultiselectFilterProps = {
  placeholder: string;
  getOptions: () => Suggestion[];
  onChange: (selectedOptions: Suggestion[]) => void;
};

export default function MultiselectFilter({
  placeholder,
  getOptions,
  onChange,
}: MultiselectFilterProps) {
  const [searchText, setSearchText] = useState<string>('');
  const [displayText, setDisplayText] = useState<string>('');
  const [
    selectedOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelectedOptions,
    addSelectedOption,
    removeSelectedOption,
  ] = [
    ...useState<Suggestion[]>([]),
    function addSelectedOption(option: Suggestion) {
      selectedOptions.push(option);
      selectedOptions.sort((a, b) =>
        a.title.localeCompare(b.title, 'en', { numeric: true }),
      );
      suggestions.splice(suggestions.indexOf(option), 1);
    },
    function removeSelectedOption(option: Suggestion) {
      selectedOptions.splice(selectedOptions.indexOf(option), 1);
      suggestions.push(option);
      suggestions.sort((a, b) =>
        a.title.localeCompare(b.title, 'en', { numeric: true }),
      );
    },
  ];
  const [suggestions, setSuggestions] = useState<Suggestion[]>(getOptions());
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const updateSelectedText = () => {
    setDisplayText(
      isEditing
        ? searchText
        : !selectedOptions || !selectedOptions.length
          ? ''
          : `${selectedOptions.length} selecionados`,
    );
  };

  const updateSuggestions = (text: string) => {
    setSuggestions(
      getOptions().filter(option =>
        option.title.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  const inputOnTextChange = (text: string) => {
    setSearchText(text);
    updateSuggestions(text);
    updateSelectedText();
  };

  const inputOnFocus = () => {
    setSuggestions(getOptions());

    setIsEditing(true);
    setIsListOpen(true);
    updateSelectedText();
  };

  const inputOnBlur = () => {
    setIsEditing(false);
    setIsListOpen(false);
    updateSelectedText();
  };

  const inputOnConfirm = () => {
    if (searchText) {
      if (!!suggestions && !!suggestions.length) {
        handleOptionChange(suggestions[0]);
      } else if (!!selectedOptions && !!selectedOptions.length) {
        handleOptionChange(selectedOptions[0]);
      }
    }

    setIsEditing(false);
    updateSelectedText();
  };

  const handleOptionChange = (option: Suggestion) => {
    const operation: ListOperation = selectedOptions.includes(option)
      ? 'REMOVED'
      : 'ADDED';

    if (operation === 'ADDED') {
      addSelectedOption(option);
    } else {
      removeSelectedOption(option);
    }

    setSearchText('');

    onChange(selectedOptions);
    setIsEditing(false);
    updateSelectedText();
  };

  const vw = Dimensions.get('window').width / 100;
  const vh = Dimensions.get('window').height / 100;

  return (
    <>
      <Pressable
        id="outer-area-touchable"
        style={{
          display: isListOpen ? 'flex' : 'none',
          elevation: 100,
          zIndex: 100,
          position: 'absolute',
          cursor: 'auto',
          top: 0,
          height: 100 * vh,
          minHeight: 100 * vh,
          width: 300 * vw,
        }}
        onPress={inputOnBlur}
      />
      <View
        style={[
          styles.container,
          {
            zIndex: isListOpen ? 101 : 1,
            elevation: isListOpen ? 101 : 1,
            margin: '1rem',
          },
        ]}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={'#747474'}
          style={[
            styles.textInput,
            {
              backgroundColor: 'white',
              padding: '0.5rem',
              borderRadius: 8,
              borderColor: '#ddd',
              borderWidth: 2,
            },
          ]}
          value={displayText}
          onChangeText={inputOnTextChange}
          onFocus={inputOnFocus}
          onSubmitEditing={inputOnConfirm}
        />
        {isListOpen && (
          <View
            id="suggestionsList"
            style={[
              styles.suggestionsList,
              {
                position: 'absolute',
                transform: [{ translateY: `2rem` }],
                width: '100%',
                backgroundColor: '#ccc',
                paddingHorizontal: '1em',
                paddingVertical: '0.25em',
              },
            ]}
          >
            {selectedOptions.concat(suggestions).map(option => {
              const isEnabled = selectedOptions.includes(option);

              return (
                <Pressable
                  id="suggestionPressable"
                  style={styles.suggestionPressable}
                  key={`${isEnabled ? 'S_' : ''}${option.id}`}
                >
                  <BouncyCheckbox
                    id="bouncyCheckbox"
                    style={styles.suggestionCheckbox}
                    textStyle={{
                      color: 'black',
                      textDecorationLine: 'none',
                    }}
                    isChecked={isEnabled}
                    text={option.title}
                    size={16}
                    fillColor="green"
                    unFillColor="white"
                    innerIconStyle={{ borderWidth: 2 }}
                    onPress={() => handleOptionChange(option)}
                  />
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </>
  );
}

const styles = EStyleSheet.create({
  textInput: {
    backgroundColor: 'white',
    padding: '0.5rem',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 2,
  },
  suggestionsList: {
    elevation: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    borderRadius: 4,
  },
  suggestionPressable: {
    padding: '1em',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
  },
});
