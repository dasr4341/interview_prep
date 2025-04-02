export interface Task {
    status: boolean,
    createdAt: Date,
    updatedAt: Date | null,
    name: string,
    id: string
}