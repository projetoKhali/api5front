export interface UserSchema {
    name: string,
    email: string,
    group: string
}

export interface CreateUserSchema {
    name: string,
    email: string,
    password: string,
    groupId: number
}

export interface CreateUserResponse {
     id: number,
     name: string,
     email: string
}