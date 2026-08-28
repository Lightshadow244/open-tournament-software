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
    roundsAndMatches: Array<Array<Match>>
    round: number
    ranks: Array<Player>
}

export type Tournaments = {
        [key: string]: Tournament;
    }

export type Player = {
    id: number
    name: string
    icon: string
}

export type Match = {
    player1: Player | null
    player1Points: number
    player2: Player | null
    player2Points: number
    winner: Player | null
    winnerId: number
    loser: Player | null
    roundId: number
    nextRoundId: number
    nextMatchId: number
    matchId: number
    name: string,
    final: boolean,
    semiFinal: boolean,
    littleFinal: boolean
}