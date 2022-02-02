
export interface IAirtableResponse {
    records: IAirtableRecord[]
}

export interface IAirtableRecord {
    fields: Object[],
    id: string
}