import React, {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Filter, { FilterRef } from '../components/filter';
import {
  PaginatedSuggestionsGetter,
  Suggestion,
  SuggestionsGetter,
} from '../schemas/Misc';
import MultiSelectFilter, {
  MultiSelectFilterRef,
} from '../components/MultiSelectFilter';
import {
  getSuggestionsRecruiter,
  getSuggestionsProcess,
  getSuggestionsVacancy,
} from '../service/Suggestions';
import { processStatuses, vacancyStatuses } from '../schemas/Status';

export type PageFilterGroupRef = {
  getRecruiters: () => Suggestion[];
  getProcesses: () => Suggestion[];
  getVacancies: () => Suggestion[];
  getProcessStatuses: () => Suggestion[];
  getVacancyStatuses: () => Suggestion[];
  getDateStart: () => string;
  getDateEnd: () => string;
};

export type PageFilterGroupProps = {
  onApplyFilters?: () => void;
  children?: ReactNode;
};

const SUGGESTIONS_PAGE_SIZE = 8;

const PageFilterGroup = forwardRef<PageFilterGroupRef, PageFilterGroupProps>(
  ({ onApplyFilters, children }, ref) => {
    const recruitersMultiSelectFilterRef = useRef<MultiSelectFilterRef>(null);
    const processesMultiSelectFilterRef = useRef<MultiSelectFilterRef>(null);
    const vacanciesMultiSelectFilterRef = useRef<MultiSelectFilterRef>(null);
    const processStatusesMultiSelectFilterRef =
      useRef<MultiSelectFilterRef>(null);
    const vacancyStatusesMultiSelectFilterRef =
      useRef<MultiSelectFilterRef>(null);
    const dateStartFilterRef = useRef<FilterRef>(null);
    const dateEndFilterRef = useRef<FilterRef>(null);

    const [selectedRecruiters, setSelectedRecruiters] = useState<Suggestion[]>(
      [],
    );
    const [selectedProcesses, setSelectedProcesses] = useState<Suggestion[]>(
      [],
    );
    const [selectedVacancies, setSelectedVacancies] = useState<Suggestion[]>(
      [],
    );

    const [selectedProcessStatuses, setSelectedProcessStatuses] = useState<
      Suggestion[]
    >([]);
    const [selectedVacancyStatuses, setSelectedVacancyStatuses] = useState<
      Suggestion[]
    >([]);

    const createFetchRecruiters =
      (): PaginatedSuggestionsGetter => async (page: number) =>
        await getSuggestionsRecruiter({
          page,
          pageSize: SUGGESTIONS_PAGE_SIZE,
        });

    const createFetchProcesses =
      (): PaginatedSuggestionsGetter => async (page: number) =>
        await getSuggestionsProcess({
          page,
          pageSize: SUGGESTIONS_PAGE_SIZE,
          ids: selectedRecruiters?.map(r => r.id) ?? [],
        });

    const createFetchVacancies =
      (): PaginatedSuggestionsGetter => async (page: number) =>
        await getSuggestionsVacancy({
          page,
          pageSize: SUGGESTIONS_PAGE_SIZE,
          ids: selectedProcesses?.map(p => p.id) ?? [],
        });

    const [recruiterSuggestionsFunc, setRecruiterSuggestionsFunc] =
      useState<SuggestionsGetter>(createFetchRecruiters);
    const [processSuggestionsFunc, setProcessSuggestionsFunc] =
      useState<SuggestionsGetter>(createFetchProcesses);
    const [vacancySuggestionsFunc, setVacancySuggestionsFunc] =
      useState<SuggestionsGetter>(createFetchVacancies);

    useImperativeHandle(ref, () => ({
      getRecruiters: () => selectedRecruiters,
      getProcesses: () => selectedProcesses,
      getVacancies: () => selectedVacancies,
      getProcessStatuses: () => selectedProcessStatuses,
      getVacancyStatuses: () => selectedVacancyStatuses,
      getDateStart: () => dateStartFilter,
      getDateEnd: () => dateEndFilter,
    }));

    useEffect(() => {
      setRecruiterSuggestionsFunc(createFetchRecruiters);
      setProcessSuggestionsFunc(createFetchProcesses);
      setVacancySuggestionsFunc(createFetchVacancies);
    }, []);

    useEffect(() => {
      recruitersMultiSelectFilterRef?.current?.update?.();
    }, [processesMultiSelectFilterRef]);

    useEffect(() => {
      processesMultiSelectFilterRef?.current?.update?.();
    }, [selectedRecruiters, processesMultiSelectFilterRef]);

    useEffect(() => {
      vacanciesMultiSelectFilterRef?.current?.update?.();
    }, [
      selectedProcesses,
      vacanciesMultiSelectFilterRef,
      processesMultiSelectFilterRef,
    ]);

    const [dateStartFilter, setDateStartFilter] = useState<string>('');
    const [dateEndFilter, setDateEndFilter] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const applyFiltersTimerRef = useRef<NodeJS.Timeout | null>(null);

    const clearFilters = async () => {
      if (!isAnyFilterActive()) return;

      setSelectedRecruiters([]);
      setSelectedProcesses([]);
      setSelectedVacancies([]);
      setSelectedProcessStatuses([]);
      setSelectedVacancyStatuses([]);
      setDateStartFilter('');
      setDateEndFilter('');

      recruitersMultiSelectFilterRef.current?.clear();
      processesMultiSelectFilterRef.current?.clear();
      vacanciesMultiSelectFilterRef.current?.clear();
      processStatusesMultiSelectFilterRef.current?.clear();
      vacancyStatusesMultiSelectFilterRef.current?.clear();
      dateStartFilterRef.current?.clear();
      dateEndFilterRef.current?.clear();
    };

    const applyFiltersDelayed = async () => {
      if (applyFiltersTimerRef.current) {
        clearTimeout(applyFiltersTimerRef.current);
      }

      setIsLoading(true);

      applyFiltersTimerRef.current = setTimeout(async () => {
        recruitersMultiSelectFilterRef.current?.update?.();
        processesMultiSelectFilterRef.current?.update?.();
        vacanciesMultiSelectFilterRef.current?.update?.();

        onApplyFilters?.();

        setIsLoading(false);
      }, 1000);
    };

    useEffect(() => {
      applyFiltersDelayed();
    }, [
      selectedRecruiters,
      selectedProcesses,
      selectedVacancies,
      dateStartFilter,
      dateEndFilter,
      selectedProcessStatuses,
      selectedVacancyStatuses,
    ]);

    const isAnyFilterActive = () =>
      selectedRecruiters.length > 0 ||
      selectedProcesses.length > 0 ||
      selectedVacancies.length > 0 ||
      dateStartFilter.length > 0 ||
      dateEndFilter.length > 0 ||
      selectedProcessStatuses.length > 0 ||
      selectedVacancyStatuses.length > 0;

    return (
      <View style={styles.filterSection}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              opacity: isAnyFilterActive() ? 1 : 0,
            },
          ]}
          disabled={!isAnyFilterActive()}
          accessible={isAnyFilterActive()}
          onPress={clearFilters}
        >
          <Text style={styles.buttonText}>Limpar filtros</Text>
        </TouchableOpacity>
        <MultiSelectFilter
          ref={recruitersMultiSelectFilterRef}
          placeholder={'Recrutadores'}
          getSuggestions={recruiterSuggestionsFunc}
          onChange={(selected: Suggestion[]) => setSelectedRecruiters(selected)}
          onClear={() => setSelectedRecruiters([])}
        />
        <MultiSelectFilter
          ref={processesMultiSelectFilterRef}
          placeholder={'Processos Seletivos'}
          getSuggestions={processSuggestionsFunc}
          onChange={(selected: Suggestion[]) => setSelectedProcesses(selected)}
          onClear={() => setSelectedProcesses([])}
        />
        <MultiSelectFilter
          ref={vacanciesMultiSelectFilterRef}
          placeholder={'Vagas'}
          getSuggestions={vacancySuggestionsFunc}
          onChange={(selected: Suggestion[]) => setSelectedVacancies(selected)}
          onClear={() => setSelectedVacancies([])}
        />
        <Filter
          ref={dateStartFilterRef}
          placeholder="Data Inicial"
          type="date"
          onChange={date => setDateStartFilter(date)}
        />
        <Filter
          ref={dateEndFilterRef}
          placeholder="Data Final"
          type="date"
          onChange={date => setDateEndFilter(date)}
        />
        <MultiSelectFilter
          ref={processStatusesMultiSelectFilterRef}
          placeholder={'Status do Processo'}
          getSuggestions={async () => vacancyStatuses}
          onChange={(selected: Suggestion[]) =>
            setSelectedProcessStatuses(selected)
          }
          onClear={() => setSelectedProcessStatuses([])}
        />
        <MultiSelectFilter
          ref={vacancyStatusesMultiSelectFilterRef}
          placeholder={'Status da Vaga'}
          getSuggestions={async () => processStatuses}
          onChange={(selected: Suggestion[]) =>
            setSelectedVacancyStatuses(selected)
          }
          onClear={() => setSelectedVacancyStatuses([])}
        />
        <View
          style={[
            styles.loading,
            {
              opacity: isLoading ? 1 : 0,
            },
          ]}
        >
          <Text>Carregando...</Text>
          <ActivityIndicator size="small" color={styles.loading.color} />
        </View>

        {children}
      </View>
    );
  },
);

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCDADA',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  filterSection: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#EDE7E7',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    paddingVertical: 10,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#F28727',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 5,
    width: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 10,
  },
  loading: {
    color: '#4f8ef7',
    alignSelf: 'center',
  },
});

PageFilterGroup.displayName = 'PageFilterGroup';
export default PageFilterGroup;
