import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
import {
  PaginatedSuggestionsGetter,
  Suggestion,
  SuggestionsGetter,
  StaticSuggestionsGetter,
} from '../schemas/Misc';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export type MultiSelectFilterRef = {
  update: () => void;
  clear: () => void;
};

export type MultiselectFilterProps = {
  placeholder: string;
  getSuggestions: SuggestionsGetter;
  onChange: (selectedOptions: Suggestion[]) => void;
  onClear?: () => void;
};

type DisplaySuggestion = Suggestion & { selected: boolean };

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

const MultiSelectFilter = forwardRef<
  MultiSelectFilterRef,
  MultiselectFilterProps
>(({ placeholder, getSuggestions, onChange, onClear }, ref) => {
  const [searchText, setSearchText] = useState<string>('');
  const [displayText, setDisplayText] = useState<string>('');

  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestions, setActiveSuggestions] = useState<Suggestion[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<Suggestion[]>([]);

  const [displayList, setDisplayList] = useState<DisplaySuggestion[]>([]);

  const [triggerSafeUpdate, setTriggerSafeUpdate] = useState<boolean>(false);
  const [triggerClearSideEffects, setTriggerClearSideEffects] =
    useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    update: async () => setTriggerSafeUpdate(true),
    clear,
  }));

  useEffect(() => {
    Promise.all([
      async () => {
        await update();
        await updateDisplayText();
      },
    ]);
  }, [getSuggestions]);

  useEffect(() => {
    if (!triggerSafeUpdate) return;

    Promise.all([
      async () => {
        await update();
        await updateDisplayText();

        setTriggerSafeUpdate(false);
      },
    ]);
  }, [triggerSafeUpdate]);


  const clear = () => {
    setSearchText('');
    setDisplayText('');

    setIsListOpen(false);
    setIsEditing(false);

    setSuggestions([]);
    activeSuggestions.concat(...selectedOptions);
    setSelectedOptions([]);

    setTriggerClearSideEffects(true);
  };

  useEffect(() => {
    if (!triggerClearSideEffects) return;

    Promise.all([
      async () => {
        await update();
        if (onClear) onClear();

        setTriggerClearSideEffects(false);
      },
    ]);
  }, [triggerClearSideEffects]);

  useEffect(() => {
    setDisplayList(
      toDisplayList(selectedOptions, true).concat(
        toDisplayList(activeSuggestions, false),
      ),
    );
  }, [suggestions, selectedOptions, activeSuggestions]);

  const update = async () => {
    if (!getSuggestions) return;

    let newSuggestions: Suggestion[];

    switch (!!getSuggestions.length) {
      case true: {
        const page = await (getSuggestions as PaginatedSuggestionsGetter)(
          currentPage,
        );

        newSuggestions = page.items;
        setTotalPages(page.numMaxPages);
        break;
      }
      default: {
        console.log('getSuggestions:', getSuggestions);
        newSuggestions = await (getSuggestions as StaticSuggestionsGetter)();
      }
    }

    updateSelectedOptions(newSuggestions);
    updateSuggestions(newSuggestions);
    updateActiveSuggestions();
  };

  useEffect(() => {
    setTriggerSafeUpdate(true);
  }, [currentPage]);

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
    await update();
    await updateDisplayText();
    setIsEditing(true);
    setTimeout(() => setIsListOpen(true), 100);
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

    await update();

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
              zIndex: isListOpen ? 103 : 1,
              elevation: isListOpen ? 103 : 1,
              backgroundColor: 'white',
              padding: '0.5rem',
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
            style={[
              styles.suggestionsList,
              {
                zIndex: isListOpen ? 102 : 1,
                elevation: isListOpen ? 102 : 1,
                position: 'absolute',
                transform: [{ translateY: `2rem` }],
                width: '100%',
                backgroundColor: '#ccc',
                paddingVertical: '0.25em',
                shadowColor: '#000',
                shadowOffset: {
                  width: 1,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 8,
              },
            ]}
          >
            {(displayList &&
              displayList.length > 0 &&
              [
                <Pressable
                  key="clear-button"
                  style={[
                    styles.suggestionPressableClear,
                    {
                      cursor: selectedOptions.length
                        ? 'pointer'
                        : 'not-allowed',
                      backgroundColor: selectedOptions.length
                        ? 'white'
                        : '#bbb',
                      paddingVertical: '0.125rem',
                      margin: '0.25rem',
                      marginBottom: '0.5rem',
                      borderWidth: 1,
                      borderBottomWidth: 2,
                      borderColor: '#ccc',
                      borderBottomColor: '#bbb',
                      borderRadius: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    },
                  ]}
                  onPress={clear}
                  disabled={!selectedOptions.length}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      color: selectedOptions.length ? 'black' : '#888',
                    }}
                  >
                    Limpar seleção
                  </Text>
                </Pressable>,
              ]
                .concat(
                  displayList.map(option => (
                    <Pressable
                      key={`${option.selected ? 'S_' : ''}${option.id}`}
                      focusable={false}
                      tabIndex={-1}
                    >
                      <BouncyCheckbox
                        style={[
                          styles.suggestionPressable,
                          {
                            paddingHorizontal: '1em',
                          },
                        ]}
                        textStyle={{
                          color: 'black',
                          textDecorationLine: 'none',
                        }}
                        isChecked={option.selected}
                        text={`${option.title}`}
                        size={16}
                        fillColor="green"
                        unFillColor="white"
                        innerIconStyle={{ borderWidth: 2 }}
                        onPress={() => handleOptionChange(option)}
                      />
                    </Pressable>
                  )),
                )
                .concat(
                  (totalPages > 1 && [
                    <View
                      key="pagination"
                      style={[
                        styles.pagination,
                        {
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: '1em',
                        },
                      ]}
                    >
                      <Pressable
                        onPress={() =>
                          currentPage > 1
                            ? setCurrentPage(Math.max(currentPage - 1, 1))
                            : {}
                        }
                        disabled={currentPage === 1}
                      >
                        <Text>&lt;</Text>
                      </Pressable>
                      <Text>
                        {currentPage} / {totalPages}
                      </Text>
                      <Pressable
                        onPress={() =>
                          currentPage < totalPages
                            ? setCurrentPage(
                                Math.min(currentPage + 1, totalPages),
                              )
                            : {}
                        }
                        disabled={currentPage === totalPages}
                      >
                        <Text>&gt;</Text>
                      </Pressable>
                    </View>,
                  ]) ||
                    [],
                )) || (
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
  pagination: {},
});

MultiSelectFilter.displayName = 'MultiSelectFilter';
export default MultiSelectFilter;
