export type Tournament = {
    id: string
    title?: string
    mode?: string
    participantCount?: number
    date?: string
    modified?: string
    location?: string
}

export type Tournaments = {
        [key: string]: Tournament;
    }