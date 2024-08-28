const groups = {
    "A": [
      {
        "Team": "Kanada",
        "ISOCode": "CAN",
        "FIBARanking": 7
      },
      {
        "Team": "Australija",
        "ISOCode": "AUS",
        "FIBARanking": 5
      },
      {
        "Team": "Grčka",
        "ISOCode": "GRE",
        "FIBARanking": 14
      },
      {
        "Team": "Španija",
        "ISOCode": "ESP",
        "FIBARanking": 2
      }
    ],
    "B": [
      {
        "Team": "Nemačka",
        "ISOCode": "GER",
        "FIBARanking": 3
      },
      {
        "Team": "Francuska",
        "ISOCode": "FRA",
        "FIBARanking": 9
      },
      {
        "Team": "Brazil",
        "ISOCode": "BRA",
        "FIBARanking": 12
      },
      {
        "Team": "Japan",
        "ISOCode": "JPN",
        "FIBARanking": 26
      }
    ],
    "C": [
      {
        "Team": "Sjedinjene Države",
        "ISOCode": "USA",
        "FIBARanking": 1
      },
      {
        "Team": "Srbija",
        "ISOCode": "SRB",
        "FIBARanking": 4
      },
      {
        "Team": "Južni Sudan",
        "ISOCode": "SSD",
        "FIBARanking": 34
      },
      {
        "Team": "Puerto Riko",
        "ISOCode": "PRI",
        "FIBARanking": 16
      }
    ]
  }

function simulateMatch(team1, team2) {
    const baseScore = 70;
    const scoreRange = 25;

    let team1Score = baseScore + Math.floor(Math.random() * scoreRange) + Math.floor((40 - team1.FIBARanking) / 10);
    let team2Score = baseScore + Math.floor(Math.random() * scoreRange) + Math.floor((40 - team2.FIBARanking) / 10);

    if (team1Score === team2Score) {
        team1Score += Math.random() > 0.5 ? 1 : -1;
    }

    const winner = team1Score > team2Score ? team1 : team2;
    const loser = team1Score > team2Score ? team2 : team1;

    return {
        winner,
        loser,
        score: `${team1Score} - ${team2Score}`
    }
}

function simulateGroupStageResults(groups) {
    let matches = {};
    let groupResults = {};

    for (let groupName in groups) {
        let group = groups[groupName];
        matches[groupName] = [];
        groupResults[groupName] = group.map(team => ({
            ...team,
            Wins: 0,
            Losses: 0,
            Points: 0,
            PointsScored: 0,
            PointsReceived: 0,
            PointDifferential: 0
        }));

        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                let team1 = groupResults[groupName][i];
                let team2 = groupResults[groupName][j];
                let matchResult = simulateMatch(team1, team2);

                matches[groupName].push(`${team1.ISOCode} ${matchResult.score} ${team2.ISOCode}`);

                if (matchResult.winner === team1) {
                    team1.Wins += 1;
                    team1.Points += 2;
                    team2.Losses +=1;
                    team2.Points +=1;
                } else {
                    team2.Wins += 1;
                    team2.Points += 2;
                    team1.Losses += 1;
                    team1.Points += 1;
                }

                team1.PointsScored += parseInt(matchResult.score.split("-")[0]);
                team1.PointsReceived += parseInt(matchResult.score.split("-")[1]);
                team2.PointsScored += parseInt(matchResult.score.split("-")[1]);
                team2.PointsReceived += parseInt(matchResult.score.split("-")[0]);
                team1.PointDifferential = team1.PointsScored - team1.PointsReceived;
                team2.PointDifferential = team2.PointsScored - team2.PointsReceived;
            }
        }

        groupResults[groupName].sort((a, b) => {
            if (b.Points === a.Points) {
                return b.PointDifferential - a.PointDifferential;
            }
            return b.Points - a.Points;
        });
    }

    return {
        groupResults,
        matches
    }
}

function printGroupStageResults(groupResults, matches) {
    for (let groupName in groupResults) {
        console.log(`\nMatches in Group ${groupName}:`);
        matches[groupName].forEach(match => console.log(`    ${match}`));

        console.log(`\nGroup ${groupName} (Name - Wins/Losses/Points/Points Scored/Points Received/Point Differential):`);
        groupResults[groupName].forEach((team, index) => {
            console.log(`    ${index + 1}. ${team.Team} - ${team.Wins} / ${team.Losses} / ${team.Points} / ${team.PointsScored} / ${team.PointsReceived} / ${team.PointDifferential}`);
            
        })
        console.log("___________________________________________")
    }
}

const { groupResults, matches } = simulateGroupStageResults(groups);
printGroupStageResults(groupResults, matches);

function rankTeams(groupResults) {
    let rankedTeams = [];

    for (let groupName in groupResults) {
        let group = groupResults[groupName];
        rankedTeams.push(...group);
    }

    rankedTeams.sort((a, b) => {
        if (a.Wins === b.Wins) {
            return b.PointDifferential - a.PointDifferential;
        }
        return b.Points - a.Points;
    });

    return rankedTeams;
}

function assignTeamsToHats(rankedTeams) {
    return {
        HatD: [rankedTeams[0], rankedTeams[1]],
        HatE: [rankedTeams[2], rankedTeams[3]],
        HatF: [rankedTeams[4], rankedTeams[5]],
        HatG: [rankedTeams[6], rankedTeams[7]],
    }
}

const rankedTeams = rankTeams(groupResults);
const hats = assignTeamsToHats(rankedTeams);

console.log("Hats:");
Object.keys(hats).forEach((hat) => {
    console.log(`\n  ${hat}:`);
    hats[hat].forEach(team => {
        console.log(`    ${team.Team}`);
    });
});

console.log("___________________________________________");

const quaterfinals = [
    { home: hats.HatE[0], away: hats.HatF[1] },
    { home: hats.HatF[0], away: hats.HatE[1] },
    { home: hats.HatD[0], away: hats.HatG[1] },
    { home: hats.HatG[0], away: hats.HatD[1] }
];

function simulateKnockoutStage(quarterfinals) {
    let semifinals = [];
    let thirdPlaceMatch = {};
    let finalMatch = {};
    let bronzeMedalWinner = {};
    let goldMedalWinner = {};

    quarterfinals.forEach((match) => {
        const result = simulateMatch(match.home, match.away);
        semifinals.push(result.winner);
        match.score = result.score;
        match.result = `${match.home.ISOCode} ${result.score} ${match.away.ISOCode}`;
    });

    const semifinalMatches = [
        { home: semifinals[0], away: semifinals[1] },
        { home: semifinals[2], away: semifinals[3] }
    ]

    semifinalMatches.forEach((match) => {
        const result = simulateMatch(match.home, match.away);
        match.score = result.score;
        match.result = `${match.home.ISOCode} ${result.score} ${match.away.ISOCode}`;

        if(semifinals.indexOf(result.winner) <= 1) {
            finalMatch.home = result.winner;
            thirdPlaceMatch.home = result.loser;
        } else {
            finalMatch.away = result.winner;
            thirdPlaceMatch.away = result.loser;
        }
    });

    const thirdPlaceResult = simulateMatch(thirdPlaceMatch.home, thirdPlaceMatch.away);
    thirdPlaceMatch.result = `${thirdPlaceMatch.home.ISOCode} ${thirdPlaceResult.score} ${thirdPlaceMatch.away.ISOCode}`;
    bronzeMedalWinner = thirdPlaceResult.winner;

    const finalResult = simulateMatch(finalMatch.home, finalMatch.away);
    finalMatch.result = `${finalMatch.home.ISOCode} ${finalResult.score} ${finalMatch.away.ISOCode}`
    goldMedalWinner = finalResult.winner;

    return {
        quarterfinals,
        semifinalMatches,
        thirdPlaceMatch,
        finalMatch,
        goldMedalWinner,
        bronzeMedalWinner
    };
}

function printTournamentResults(results) {
    console.log("Quarterfinals:");
    results.quarterfinals.forEach((match) => console.log(`    ${match.result}`));

    console.log("\nSemifinals:");
    results.semifinalMatches.forEach((match) => console.log(`    ${match.result}`));

    console.log("\nThird place match:");
    console.log(`    ${results.thirdPlaceMatch.result}`);

    console.log("\nFinals:");
    console.log(`    ${results.finalMatch.result}`);

    console.log("\nMedals:");
    console.log(`    1. ${results.goldMedalWinner.Team}`);
    console.log(`    2. ${results.finalMatch.home.Team === results.goldMedalWinner.Team ? results.finalMatch.away.Team : results.finalMatch.home.Team}`);
    console.log(`    3. ${results.bronzeMedalWinner.Team}`);
}

const tournamentResults = simulateKnockoutStage(quaterfinals);

printTournamentResults(tournamentResults);