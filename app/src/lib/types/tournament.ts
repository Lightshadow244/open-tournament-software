export type Tournament = {
    id: string
    status: string
    title: string
    mode: string
    date: string
    time: string
    modified: string
    location: string
    players: Array<Player>
    matches: Array<Array<Match>> | null
    round: number
}

export type Tournaments = {
        [key: string]: Tournament;
    }

export type Player = {
    name: string
    icon: string
}

export type Match = {
    player1: Player | null
    player1Points: number
    player2: Player | null
    player2Points: number
    winner: Player | null
    roundId: number
    nextRoundId: number
    nextMatchId: number
    matchId: number
}