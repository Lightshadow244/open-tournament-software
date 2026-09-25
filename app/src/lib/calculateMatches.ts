import type { Tournament, Player, Match } from '$lib/types/tournament';


export function calculateMatches(tournament:Tournament):Array<Array<Match>>{
    tournament.roundsAndMatches = [];
    
    if (tournament.mode === "Single Elimination") {
        tournament.roundsAndMatches = calculateSEMatches(tournament);
    }else if(tournament.mode === "Round Robin"){
        tournament.roundsAndMatches = calculateRRMatches(tournament);
    }
    return(tournament.roundsAndMatches);
}

export function fillNextRound(tournament: Tournament):Array<Array<Match>>{
    if (tournament.mode === "Single Elimination") {
        tournament.roundsAndMatches = fillNextRoundSE(tournament);
    }else if(tournament.mode === "Round Robin"){
        // nothing to do
    }
    return(tournament.roundsAndMatches);
}

export function calculateRanks(tournament: Tournament): Array<Array<[Player, number]>>{
    let  ranks: Array<Array<[Player, number]>> = [];
    if (tournament.mode === "Single Elimination") {
        ranks = calculateSERanks(tournament.roundsAndMatches, tournament.players);
    }else if(tournament.mode === "Round Robin"){
        ranks = calculateRRRanks(tournament.roundsAndMatches, tournament.players);
    }

    return(ranks);
}

// #region Single Elimination

function calculateSEMatches(tournament:Tournament):Array<Array<Match>>{
    let roundsAndMatches:Array<Array<Match>> = [];
    const maxRounds = getLog2(tournament.players.length);
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

// function calculateSERanks(roundsAndMatches: Array<Array<Match>>):Array<Player> {
    // let  ranks = <Array<Player>>  [];

    // let final = roundsAndMatches[roundsAndMatches.length - 1];

    // ranks.push(<Player> final[0].winner);
    // ranks.push(<Player> final[0].loser);
    // ranks.push(<Player> final[1].winner);
    // ranks.push(<Player> final[1].loser);

    // return(ranks);
function calculateSERanks(roundsAndMatches: Array<Array<Match>>, players: Array<Player>):Array<Array<[Player, number]>> {
    let ranks: Array<Array<[Player, number]>> = [[],[],[],[]];
    let final = roundsAndMatches[roundsAndMatches.length - 1];

    ranks[0].push([<Player> final[0].winner, 0])
    ranks[1].push([<Player> final[0].loser, 0])
    ranks[2].push([<Player> final[1].winner, 0])
    ranks[3].push([<Player> final[1].loser, 0])

    

    return(ranks);
}

// #endregion Single Elimination

// #region Round Robin

function calculateRRMatches(tournament:Tournament):Array<Array<Match>>{
    let roundsAndMatches:Array<Array<Match>> = [];
    
    // fill player count to even number with empty player
    let playersFilled = tournament.players.slice(0);
    if (playersFilled.length % 2 != 0) {
        playersFilled.push({
            id: -1,
            name: "filler",
            icon: "",
            iconColor: "",
            changeIcon: false
        })
    }

    const maxRounds = playersFilled.length - 1;
    const maxMatches = playersFilled.length / 2;

    // calculate all possible match combination
    let possibleCombinations = [] as Array<Array<Player>>;
    for(let i = 0; i < playersFilled.length; i++){
        for(let j = i + 1; j < playersFilled.length; j++){
            possibleCombinations.push([playersFilled[i], playersFilled[j]])
        }
    }

    // map all combinations to parallel matches for every round
    for (let roundId = 0; roundId < maxRounds; roundId++) {
        let playersInRound = [] as Array<Player>;

        //recursive function, adding one match to round, when not ok next match until it is ok
        // when not ok, returning empty array
        function addMatchToRound(round:Array<Match>, index:number):Array<Match>{
            if (round.length == maxMatches) {
                return(round)
            }else{
                while (index < possibleCombinations.length) {
                        const newMatch = {
                            player1: null,
                            player1Points: 0,
                            player2: null,
                            player2Points: 0,
                            winner: null,
                            winnerId: 0,
                            loser: null,
                            roundId: roundId,
                            nextRoundId: -1,
                            matchId: round.length,
                            nextMatchId: -1,
                            name: "",
                            final: false,
                            semiFinal: false,
                            littleFinal: false
                            } as Match;

                        
                    if (playersInRound.includes(possibleCombinations[index][0]) == false && playersInRound.includes(possibleCombinations[index][1]) == false) {
                        playersInRound.push(possibleCombinations[index][0]);
                        playersInRound.push(possibleCombinations[index][1]);

                        newMatch.player1 = possibleCombinations[index][0];
                        newMatch.player2 = possibleCombinations[index][1];

                        round.push(newMatch);

                        let newRound = addMatchToRound(round.slice(0), index)

                        if (newRound.length == 0) {
                            round.pop();
                            playersInRound.pop();
                            playersInRound.pop();
                        }else{
                            possibleCombinations.splice(index, 1);
                            return(newRound)
                        }
                    }
                    index++;
                }
            }
            return([])
        }
        roundsAndMatches.push(addMatchToRound([],0))
    }
    return(roundsAndMatches);
}

function calculateRRRanks(roundsAndMatches: Array<Array<Match>>, players: Array<Player>):Array<Array<[Player, number]>> {
    // count wins
    let ranks: { [key: number]: number } = {};
    roundsAndMatches.forEach(round => {
        round.forEach(match => {
            if(ranks[match.player1?.id as number] == undefined){
                ranks[match.player1?.id as number] = 0;
            }

            if(ranks[match.player2?.id as number] == undefined){
                ranks[match.player2?.id as number] = 0;
            }

            if (match.winner) {
                ranks[match.winner.id] += 1;
            }
        })
    })
    // sort players after wins
    let sortedRanks = Object.entries(ranks).sort((a, b) => b[1] - a[1]);

    // 
    let rankCounter = 0;
    let wins = 0;
    let finalRanks: Array<Array<[Player, number]>> = [[],[],[],[]];
    for (let index = 0; index < sortedRanks.length; index++) {
        const rank = sortedRanks[index];
        if (wins == 0) {
            finalRanks[0].push([players[parseInt(rank[0])], rank[1]])
            wins = rank[1]
        }else if(wins == rank[1]){
            finalRanks[rankCounter].push([players[parseInt(rank[0])], rank[1]])
        }else{
            rankCounter++;
            if (rankCounter == finalRanks.length) {
                break;
            }
            finalRanks[rankCounter].push([players[parseInt(rank[0])], rank[1]])
            wins = rank[1]
        }
    }

    return(finalRanks);
}

// #endregion Round Robin

export function getLog2(x:number) {
  return Math.log(x) / Math.log(2);
}