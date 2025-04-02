export interface UserSchemaInterface {
    name: string, 
    email: String,
    authentication: {
        password: string,
        salt: string,
        sessionToken?: string
    }
}