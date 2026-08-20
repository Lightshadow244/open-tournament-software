import type { Player, Match } from '$lib/types/tournament';

export function calculateSingleEliminationMatches(players:Array<Player>):Array<Match>{
    const matches = [] as Array<Match>;
    if (players.length % 4 == 0) {
        let pcount = players.length;
        let roundId = 0;
        let matchId = 0;

        // initialize matches, set players for first round
        while (pcount > 1) {
            pcount = pcount / 2;

            for (let index = 0; index < pcount; index++) {
                const newMatch = {
                player1: null,
                player1Points: 0,
                player2: null,
                player2Points: 0,
                winner: null,
                roundId: roundId,
                nextRoundId: roundId + 1,
                matchId: matchId,
                nextMatchId: Math.round(matchId / 2)
                } as Match;

                if (roundId == 0) {
                    newMatch.player1 = players[matchId * 2];
                    newMatch.player2 = players[(matchId * 2) + 1];
                }
                matches.push(newMatch);
                matchId = matchId + 1;
                
            }
            roundId = roundId + 1
        }
    }
    return(matches)
}