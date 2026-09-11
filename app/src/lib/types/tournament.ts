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
    iconColor: string
    changeIcon: boolean
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

export function changePlayerPointsForMatch(tournament:Tournament, roundId:number, matchId:number, playerId:number, points:number):Tournament{
        if (tournament.roundsAndMatches != null) {
            // add points
            if (playerId == 1) {
                tournament.roundsAndMatches[roundId][matchId].player1Points = points;
            }else if(playerId == 2){
                tournament.roundsAndMatches[roundId][matchId].player2Points = points;
            }

            //change winner
            if (tournament.roundsAndMatches[roundId][matchId].player1Points == tournament.roundsAndMatches[roundId][matchId].player2Points) {
                tournament.roundsAndMatches[roundId][matchId].winner = null;
                tournament.roundsAndMatches[roundId][matchId].loser = null
                tournament.roundsAndMatches[roundId][matchId].winnerId = 0;
            }else if (tournament.roundsAndMatches[roundId][matchId].player1Points > tournament.roundsAndMatches[roundId][matchId].player2Points) {
                tournament.roundsAndMatches[roundId][matchId].winner = tournament.roundsAndMatches[roundId][matchId].player1
                tournament.roundsAndMatches[roundId][matchId].loser = tournament.roundsAndMatches[roundId][matchId].player2
                tournament.roundsAndMatches[roundId][matchId].winnerId = 1;
            }else if (tournament.roundsAndMatches[roundId][matchId].player1Points < tournament.roundsAndMatches[roundId][matchId].player2Points) {
                tournament.roundsAndMatches[roundId][matchId].winner = tournament.roundsAndMatches[roundId][matchId].player2
                tournament.roundsAndMatches[roundId][matchId].loser = tournament.roundsAndMatches[roundId][matchId].player1
                tournament.roundsAndMatches[roundId][matchId].winnerId = 2;
            }
        }
        // console.log(tournament)
        return(tournament)
    }