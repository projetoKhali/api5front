export type PaginatedSuggestionsGetter = (
  page: number,
) => Promise<Page<Suggestion>>;
export type StaticSuggestionsGetter = () => Promise<Suggestion[]>;

export type SuggestionsGetter =
  | PaginatedSuggestionsGetter
  | StaticSuggestionsGetter;

export type PageRequest = {
  page: number;
  pageSize: number;
};

export type PageFilterRequest<T> = PageRequest & T;

export type Page<T> = {
  items: T[];
  numMaxPages: number;
};

export const emptyPage = <T>(): Page<T> => ({
  items: [],
  numMaxPages: 1,
});

export interface Suggestion {
  id: number;
  title: string;
}
