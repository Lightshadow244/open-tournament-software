import type { Tournament, Player, Match } from '$lib/types/tournament';

export function calculateMatches(mode:string, players:Array<Player>, roundsAndMatches:Array<Array<Match>>):Array<Array<Match>>{
    
    if (mode === "Single Elimination") {
        roundsAndMatches = calculateSingleEliminationMatches(players, roundsAndMatches);
        // roundsAndMatches = checkForFinalAndSemiFinal(roundsAndMatches);
    }
    return(roundsAndMatches)
}

export function calculateRanks(tournament: Tournament): Array<Player>{
    let  ranks = <Array<Player>> [];
    if (tournament.mode === "Single Elimination") {
        ranks = calculateSingleEliminationRanks(tournament.roundsAndMatches)
    }
    return(ranks);
}

export function fillTemporaryMatches(tournament:Tournament): Array<Array<Match>>{
    let filledMatches = <Array<Array<Match>>> []
    if (tournament.mode === "Single Elimination") {
        filledMatches = fillTemporarySingleEliminationMatches(tournament)
    }
    return(filledMatches)
}

function calculateSingleEliminationMatches(players:Array<Player>, roundsAndMatches:Array<Array<Match>>):Array<Array<Match>>{
    
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
                    roundsAndMatches[roundsAndMatches.length - 1][lastMatch.nextMatchId].player1 = lastMatch.winner;
                }else{
                    roundsAndMatches[roundsAndMatches.length - 1][lastMatch.nextMatchId].player2 = lastMatch.winner;
                }
                
            })
        }

        // check for semi-final; check for final match and add little final
        if (roundsAndMatches[roundId].length == 2){
            roundsAndMatches[roundId][0].name = "Semi-Final 1";
            roundsAndMatches[roundId][0].semiFinal = true;
            roundsAndMatches[roundId][1].name = "Semi-Final 2";
            roundsAndMatches[roundId][1].semiFinal = true;
        }else if (roundsAndMatches[roundId].length == 1){
            roundsAndMatches[roundId][0].nextRoundId = -1;
            roundsAndMatches[roundId][0].nextMatchId = -1;
            roundsAndMatches[roundId][0].name = "Final";
            roundsAndMatches[roundId][0].final = true;

            const newMatch = {
                player1: null,
                player1Points: 0,
                player2: null,
                player2Points: 0,
                winnerId: 0,
                winner: null,
                loser: null,
                roundId: roundId,
                nextRoundId: -1,
                matchId: matchId,
                nextMatchId: -1,
                name: "Little-Final",
                final: false,
                semiFinal: false,
                littleFinal: true
                } as Match;
            
            const semiFinalMatches = roundsAndMatches[roundsAndMatches.length - 2];
            newMatch.player1 = semiFinalMatches[0].loser;
            newMatch.player2 = semiFinalMatches[1].loser;

            roundsAndMatches[roundId].push(newMatch);

        }

        
        
    }
    return(roundsAndMatches)
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

function fillTemporarySingleEliminationMatches(tournament:Tournament): Array<Array<Match>>{
    const maxRounds = getLog2(tournament.players.length);   // 3
    let roundId = tournament.roundsAndMatches.length;      // 1

    while (roundId < maxRounds) {
        tournament.roundsAndMatches.push([])

        let matchCount = tournament.roundsAndMatches[roundId - 1].length / 2; // 2 // 1

        for (let index = 0; index < matchCount; index++) {
            const emptyMatch = {
                player1: null,
                player1Points: 0,
                player2: null,
                player2Points: 0,
                winnerId: 0,
                winner: null,
                loser: null,
                roundId: roundId,
                nextRoundId: -1,
                matchId: index,
                nextMatchId: -1,
                name: "",
                final: false,
                semiFinal: false,
                littleFinal: false
                } as Match;
            tournament.roundsAndMatches[roundId].push(emptyMatch);
        }
        roundId++;
    }

    return(tournament.roundsAndMatches);
}



export function getLog2(x:number) {
  return Math.log(x) / Math.log(2);
}