import { Suggestion } from "./Suggestion"

export interface GroupAccessSchema {
    id: number,
    name: string,
    departments: Suggestion[]
}

export interface CreateGroupAccessSchema {
    name: string,
    departments: number[]
}

export interface CreateGroupAccessResponse {
    id: number,
    name: string
}