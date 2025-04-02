export interface ReportLogPayload {
    userId: string;
    date: string;
}

export interface ReportLogApiResponse {
    id: string
    step: string
    status: boolean
    user_id: string
    email: string
    logs: string
    created_at: string
    updated_at: string
    deleted_at: any
  }
  