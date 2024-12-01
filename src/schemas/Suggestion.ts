export interface Suggestion {
  id: number;
  title: string;
}


export interface BodySuggestion {
  filterIds: number[],
  departments: number[]

}