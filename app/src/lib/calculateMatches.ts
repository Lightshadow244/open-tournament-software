import type { Tournament, Player, Match } from '$lib/types/tournament';


export function calculateMatches(tournament:Tournament):Array<Array<Match>>{
    tournament.roundsAndMatches = [];
    
    if (tournament.mode === "Single Elimination") {
        tournament.roundsAndMatches = calculateSEMatches(tournament);
    }
    return(tournament.roundsAndMatches)
}

export function fillNextRound(tournament: Tournament):Array<Array<Match>>{
     if (tournament.mode === "Single Elimination") {
        tournament.roundsAndMatches = fillNextRoundSE(tournament);
    }
    return(tournament.roundsAndMatches)
}

export function calculateRanks(tournament: Tournament): Array<Player>{
    let  ranks = <Array<Player>> [];
    if (tournament.mode === "Single Elimination") {
        ranks = calculateSingleEliminationRanks(tournament.roundsAndMatches)
    }
    return(ranks);
}

function calculateSEMatches(tournament:Tournament):Array<Array<Match>>{
    let roundsAndMatches:Array<Array<Match>> = []
    const maxRounds = getLog2(tournament.players.length)
    if (Number.isInteger(maxRounds)) {
        // build structure
        for (let roundId = 0; roundId < maxRounds; roundId++) {
            roundsAndMatches.push([])
            const maxMatchesCount = tournament.players.length / (2 ** (roundId + 1))
            for (let matchId = 0; matchId < maxMatchesCount; matchId++) {
                const newMatch = {
                    player1: null,
                    player1Points: 0,
                    player2: null,
                    player2Points: 0,
                    winner: null,
                    winnerId: 0,
                    loser: null,
                    roundId: roundId,
                    nextRoundId: roundId + 1,
                    matchId: matchId,
                    nextMatchId: Math.floor(matchId / 2),
                    name: "",
                    final: false,
                    semiFinal: false,
                    littleFinal: false
                    } as Match;
                    roundsAndMatches[roundId].push(newMatch);
            }
        }

        //change status for semi-final, little-final and final
        const lastRoundId = roundsAndMatches.length - 1;
        //final
        roundsAndMatches[lastRoundId][0].final = true; 
        roundsAndMatches[lastRoundId][0].nextMatchId = -1;
        roundsAndMatches[lastRoundId][0].nextRoundId = -1;

        //little final
        roundsAndMatches[lastRoundId].push({
            player1: null,
            player1Points: 0,
            player2: null,
            player2Points: 0,
            winner: null,
            winnerId: 0,
            loser: null,
            roundId: lastRoundId,
            nextRoundId: -1,
            matchId: 1,
            nextMatchId: -1,
            name: "",
            final: false,
            semiFinal: false,
            littleFinal: true
        }) 

        //semi final
        roundsAndMatches[lastRoundId - 1][0].semiFinal = true;
        roundsAndMatches[lastRoundId - 1][1].semiFinal = true;

        // fill first round with players
        let playerId = 0;
        roundsAndMatches[0].forEach(match => {
            match.player1 = tournament.players[playerId]
            playerId++;
            match.player2 = tournament.players[playerId]
            playerId++;
        })
    }
    return(roundsAndMatches)
}

function fillNextRoundSE(tournament:Tournament):Array<Array<Match>>{
    tournament.roundsAndMatches[tournament.round].forEach(matchOldRound => {
        if (tournament.roundsAndMatches[matchOldRound.nextRoundId][matchOldRound.nextMatchId].player1 == null) {
            
            tournament.roundsAndMatches[matchOldRound.nextRoundId][matchOldRound.nextMatchId].player1 = matchOldRound.winner;
        }else{
            tournament.roundsAndMatches[matchOldRound.nextRoundId][matchOldRound.nextMatchId].player2 = matchOldRound.winner;
        }
    })

    // check if next round is last round than add losers to little final
    if (tournament.round + 1 == tournament.roundsAndMatches.length - 1) {
        tournament.roundsAndMatches[tournament.roundsAndMatches.length-1][1].player1 = tournament.roundsAndMatches[tournament.roundsAndMatches.length-2][0].loser;

        tournament.roundsAndMatches[tournament.roundsAndMatches.length-1][1].player2 = tournament.roundsAndMatches[tournament.roundsAndMatches.length-2][1].loser;
    }

    return(tournament.roundsAndMatches)
}

function calculateSingleEliminationRanks(roundsAndMatches: Array<Array<Match>>):Array<Player> {
    let  ranks = <Array<Player>>  [];

    let final = roundsAndMatches[roundsAndMatches.length - 1];

    ranks.push(<Player> final[0].winner);
    ranks.push(<Player> final[0].loser);
    ranks.push(<Player> final[1].winner);
    ranks.push(<Player> final[1].loser);

    return(ranks);
}
export function getLog2(x:number) {
  return Math.log(x) / Math.log(2);
}