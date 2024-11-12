import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
import { Suggestion } from '../schemas/Suggestion';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export type MultiSelectFilterRef = {
  clear: () => void;
};

export type MultiselectFilterProps = {
  placeholder: string;
  getSuggestions: () => Suggestion[];
  onChange: (selectedOptions: Suggestion[]) => void;
};

type DisplaySuggestion = Suggestion & { selected: boolean };

const MultiSelectFilter = forwardRef<
  MultiSelectFilterRef,
  MultiselectFilterProps
>(({ placeholder, getSuggestions, onChange }, ref) => {
  const [searchText, setSearchText] = useState<string>('');
  const [displayText, setDisplayText] = useState<string>('');

  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestions, setActiveSuggestions] = useState<Suggestion[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<Suggestion[]>([]);

  const [displayList, setDisplayList] = useState<DisplaySuggestion[]>([]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setSearchText('');
      setDisplayText('');

      setIsListOpen(false);
      setIsEditing(false);

      setSuggestions([]);
      setActiveSuggestions([]);
      setSelectedOptions([]);

      setDisplayList([]);

      update();
    },
    update: async () => {
      update();
      await updateDisplayText();
    },
  }));

  useEffect(() => {
    update();
    updateDisplayText();
  }, [getSuggestions]);

  useEffect(() => {
    setDisplayList(
      toDisplayList(selectedOptions, true).concat(
        toDisplayList(activeSuggestions, false),
      ),
    );
  }, [selectedOptions, activeSuggestions]);

  const update = () => {
    const newSuggestions = getSuggestions();

    updateSelectedOptions(newSuggestions);
    updateSuggestions(newSuggestions);
    updateActiveSuggestions();
  };

  function addSelectedOption(option: Suggestion) {
    selectedOptions.push(option);
  }
  function removeSelectedOption(option: Suggestion) {
    selectedOptions.splice(selectedOptions.indexOf(option), 1);
    suggestions.push(option);
  }

  const updateDisplayText = async () => {
    setDisplayText(
      isEditing
        ? ''
        : !!selectedOptions && !!selectedOptions.length
          ? `${selectedOptions.length} selecionados`
          : '',
    );
  };

  const updateSelectedOptions = (newSuggestions: Suggestion[]) => {
    setSelectedOptions(
      sort(
        selectedOptions.filter(option =>
          listContainsWith(newSuggestions, option, 'id'),
        ),
      ),
    );
  };

  const updateSuggestions = (newSuggestions: Suggestion[]) => {
    setSuggestions(
      newSuggestions.filter(
        option => !listContainsWith(selectedOptions, option, 'id'),
      ),
    );
  };

  const updateActiveSuggestions = () => {
    const unselectedSuggestions = suggestions.filter(
      option => !listContainsWith(selectedOptions, option, 'id'),
    );

    setActiveSuggestions(
      sort(
        !!searchText && searchText.length > 0
          ? unselectedSuggestions.filter(option =>
              option.title.toLowerCase().includes(searchText.toLowerCase()),
            )
          : unselectedSuggestions,
      ),
    );
  };

  const inputOnTextChange = async (text: string) => {
    setSearchText(text);
    updateActiveSuggestions();
    await updateDisplayText();
  };

  const inputOnFocus = async () => {
    update();
    await updateDisplayText();
    setIsEditing(true);
    setIsListOpen(true);
    // setTimeout(() => setIsListOpen(true), 100);
  };

  const inputOnBlur = async () => {
    setIsListOpen(false);
    await updateDisplayText();
  };

  const inputOnConfirm = () => {
    if (searchText) {
      if (!!suggestions && !!suggestions.length) {
        handleOptionChange(suggestions[0]);
      } else if (!!selectedOptions && !!selectedOptions.length) {
        handleOptionChange(selectedOptions[0]);
      }
    }

    updateDisplayText();
  };

  const handleOptionChange = async (option: Suggestion) => {
    if (!listContainsWith(selectedOptions, option, 'id')) {
      addSelectedOption(option);
    } else {
      removeSelectedOption(option);
    }

    update();

    setSearchText('');

    await updateDisplayText();
    onChange(selectedOptions);
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
          placeholder={displayText || placeholder}
          placeholderTextColor={displayText ? '#FF8C00' : '#747474'}
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
          value={!!displayText && !!displayText.length ? '' : searchText}
          onChangeText={inputOnTextChange}
          onFocus={inputOnFocus}
          onBlur={() => setIsEditing(false)}
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
            {(displayList &&
              displayList.length > 0 &&
              displayList.map(option => (
                <Pressable
                  id="suggestionPressable"
                  style={styles.suggestionPressable}
                  key={`${option.selected ? 'S_' : ''}${option.id}`}
                >
                  <BouncyCheckbox
                    id="bouncyCheckbox"
                    style={styles.suggestionCheckbox}
                    textStyle={{ color: 'black', textDecorationLine: 'none' }}
                    isChecked={option.selected}
                    text={`${option.title}`}
                    size={16}
                    fillColor="green"
                    unFillColor="white"
                    innerIconStyle={{ borderWidth: 2 }}
                    onPress={() => handleOptionChange(option)}
                  />
                </Pressable>
              ))) || (
              <View style={styles.suggestionPressable}>
                <Text>Nenhum dado disponível</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
});

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listContainsWith = <T extends Record<string, any>>(
  list: T[],
  element: T,
  key: string,
) => list.some((item: T) => item[key] === element[key]);

const sort = (list: Suggestion[]): Suggestion[] =>
  list.sort((a, b) =>
    a?.title.localeCompare(b?.title, 'en', { numeric: true }),
  );

const toDisplaySuggestion = (
  option: Suggestion,
  selected: boolean,
): DisplaySuggestion => ({
  ...option,
  selected,
});

const toDisplayList = (
  list: Suggestion[],
  selected: boolean,
): DisplaySuggestion[] =>
  list.map(option => toDisplaySuggestion(option, selected));


MultiSelectFilter.displayName = 'MultiSelectFilter';
export default MultiSelectFilter;
