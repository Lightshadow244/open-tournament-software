import type { Player, Match } from '$lib/types/tournament';

export function calculateMatches(mode:string, players:Array<Player>, roundsAndMatches:Array<Array<Match>>):Array<Array<Match>>{
    
    if (mode === "Single Elimination") {
        roundsAndMatches = calculateSingleEliminationMatches(players, roundsAndMatches);
    }

    return(roundsAndMatches)
}

export function calculateSingleEliminationMatches(players:Array<Player>, roundsAndMatches:Array<Array<Match>>):Array<Array<Match>>{
    
    if (players.length % 4 == 0) {
        let roundId = 0;
        let matchId = 0;

        if (roundsAndMatches.length != 0) {
            roundId = roundsAndMatches[roundsAndMatches.length - 1][0].roundId + 1;
        }
        const maxMatchesCount = players.length / (2 ** (roundId + 1))

        // initialize matches, set players for first round
        roundsAndMatches.push([])
        for (let index = 0; index < maxMatchesCount; index++) {
            const newMatch = {
                player1: null,
                player1Points: 0,
                player2: null,
                player2Points: 0,
                winner: 0,
                roundId: roundId,
                nextRoundId: roundId + 1,
                matchId: matchId,
                nextMatchId: Math.floor(matchId / 2)
                } as Match;
            if (roundId == 0) {
                newMatch.player1 = players[matchId * 2];
                newMatch.player2 = players[(matchId * 2) + 1];
            }
            roundsAndMatches[roundId].push(newMatch);
            matchId = matchId + 1;
        }

        // add winner from last match, check if it should be player 1 or 2
        if (roundId > 0) {
            roundsAndMatches[roundsAndMatches.length - 2].forEach(lastMatch => {
                if (roundsAndMatches[roundsAndMatches.length - 1][lastMatch.nextMatchId].player1 == null) {
                    if (lastMatch.winner == 1) {
                        roundsAndMatches[roundsAndMatches.length - 1][lastMatch.nextMatchId].player1 = lastMatch.player1;
                    }else if(lastMatch.winner == 2){
                        roundsAndMatches[roundsAndMatches.length - 1][lastMatch.nextMatchId].player1 = lastMatch.player2;
                    } 
                }else{
                    if (lastMatch.winner == 1) {
                        roundsAndMatches[roundsAndMatches.length - 1][lastMatch.nextMatchId].player2 = lastMatch.player1;
                    }else if(lastMatch.winner == 2){
                        roundsAndMatches[roundsAndMatches.length - 1][lastMatch.nextMatchId].player2 = lastMatch.player2;
                    } 
                }
                
            })
        }
        
    }
    return(roundsAndMatches)
}
