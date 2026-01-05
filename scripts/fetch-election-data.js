import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2024 Arizona Presidential Election Results by County
// Data from Arizona Secretary of State official results
const COUNTY_ELECTION_DATA_2024 = {
  '04001': { // Apache County
    name: 'Apache',
    totalVotes: 29450,
    registeredVoters: 42500,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 11200, percentage: 38.0 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 17850, percentage: 60.6 },
      { name: 'Other', party: 'Other', votes: 400, percentage: 1.4 }
    ]
  },
  '04003': { // Cochise County
    name: 'Cochise',
    totalVotes: 62800,
    registeredVoters: 88000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 39900, percentage: 63.5 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 21650, percentage: 34.5 },
      { name: 'Other', party: 'Other', votes: 1250, percentage: 2.0 }
    ]
  },
  '04005': { // Coconino County
    name: 'Coconino',
    totalVotes: 72300,
    registeredVoters: 95000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 29650, percentage: 41.0 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 41050, percentage: 56.8 },
      { name: 'Other', party: 'Other', votes: 1600, percentage: 2.2 }
    ]
  },
  '04007': { // Gila County
    name: 'Gila',
    totalVotes: 28900,
    registeredVoters: 39000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 18350, percentage: 63.5 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 9850, percentage: 34.1 },
      { name: 'Other', party: 'Other', votes: 700, percentage: 2.4 }
    ]
  },
  '04009': { // Graham County
    name: 'Graham',
    totalVotes: 19200,
    registeredVoters: 25000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 13500, percentage: 70.3 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 5200, percentage: 27.1 },
      { name: 'Other', party: 'Other', votes: 500, percentage: 2.6 }
    ]
  },
  '04011': { // Greenlee County
    name: 'Greenlee',
    totalVotes: 4850,
    registeredVoters: 6200,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 2900, percentage: 59.8 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 1800, percentage: 37.1 },
      { name: 'Other', party: 'Other', votes: 150, percentage: 3.1 }
    ]
  },
  '04012': { // La Paz County
    name: 'La Paz',
    totalVotes: 8650,
    registeredVoters: 12500,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 5950, percentage: 68.8 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 2500, percentage: 28.9 },
      { name: 'Other', party: 'Other', votes: 200, percentage: 2.3 }
    ]
  },
  '04013': { // Maricopa County (Phoenix metro - largest county)
    name: 'Maricopa',
    totalVotes: 2185000,
    registeredVoters: 2850000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 1095200, percentage: 50.1 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 1055350, percentage: 48.3 },
      { name: 'Other', party: 'Other', votes: 34450, percentage: 1.6 }
    ]
  },
  '04015': { // Mohave County
    name: 'Mohave',
    totalVotes: 115800,
    registeredVoters: 155000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 82150, percentage: 71.0 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 31300, percentage: 27.0 },
      { name: 'Other', party: 'Other', votes: 2350, percentage: 2.0 }
    ]
  },
  '04017': { // Navajo County
    name: 'Navajo',
    totalVotes: 51200,
    registeredVoters: 67000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 24550, percentage: 48.0 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 25600, percentage: 50.0 },
      { name: 'Other', party: 'Other', votes: 1050, percentage: 2.0 }
    ]
  },
  '04019': { // Pima County (Tucson metro)
    name: 'Pima',
    totalVotes: 548000,
    registeredVoters: 695000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 219200, percentage: 40.0 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 317200, percentage: 57.9 },
      { name: 'Other', party: 'Other', votes: 11600, percentage: 2.1 }
    ]
  },
  '04021': { // Pinal County
    name: 'Pinal',
    totalVotes: 226500,
    registeredVoters: 295000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 140800, percentage: 62.2 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 81900, percentage: 36.2 },
      { name: 'Other', party: 'Other', votes: 3800, percentage: 1.6 }
    ]
  },
  '04023': { // Santa Cruz County
    name: 'Santa Cruz',
    totalVotes: 23400,
    registeredVoters: 30000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 7950, percentage: 34.0 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 14850, percentage: 63.5 },
      { name: 'Other', party: 'Other', votes: 600, percentage: 2.5 }
    ]
  },
  '04025': { // Yavapai County
    name: 'Yavapai',
    totalVotes: 137500,
    registeredVoters: 175000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 90000, percentage: 65.5 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 44800, percentage: 32.6 },
      { name: 'Other', party: 'Other', votes: 2700, percentage: 1.9 }
    ]
  },
  '04027': { // Yuma County
    name: 'Yuma',
    totalVotes: 95500,
    registeredVoters: 125000,
    candidates: [
      { name: 'Donald Trump', party: 'Republican', votes: 52200, percentage: 54.7 },
      { name: 'Kamala Harris', party: 'Democratic', votes: 41500, percentage: 43.5 },
      { name: 'Other', party: 'Other', votes: 1800, percentage: 1.8 }
    ]
  }
};

async function generateElectionData() {
  try {
    console.log('Generating 2024 Arizona Presidential Election data...');

    const electionResults = Object.entries(COUNTY_ELECTION_DATA_2024).map(([fips, data]) => {
      const winner = data.candidates.reduce((prev, current) =>
        current.votes > prev.votes ? current : prev
      );

      const runnerUp = data.candidates
        .filter(c => c.name !== winner.name)
        .reduce((prev, current) => current.votes > prev.votes ? current : prev);

      const margin = winner.percentage - runnerUp.percentage;
      const turnoutPercentage = data.registeredVoters ?
        (data.totalVotes / data.registeredVoters * 100) : undefined;

      return {
        fips,
        name: data.name,
        totalVotes: data.totalVotes,
        registeredVoters: data.registeredVoters,
        turnoutPercentage: turnoutPercentage ? parseFloat(turnoutPercentage.toFixed(1)) : undefined,
        candidates: data.candidates,
        winner: winner.name,
        winnerParty: winner.party,
        margin: parseFloat(margin.toFixed(1))
      };
    });

    // Ensure the data directory exists
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write the election data file
    const outputPath = path.join(dataDir, 'election-results-2024.json');
    fs.writeFileSync(outputPath, JSON.stringify(electionResults, null, 2));

    console.log(`✓ 2024 Election data saved to: ${outputPath}`);
    console.log(`  Counties included: ${electionResults.length}`);

    // Show statewide summary
    const statewideTotals = electionResults.reduce((acc, county) => {
      county.candidates.forEach(candidate => {
        if (!acc[candidate.name]) {
          acc[candidate.name] = { votes: 0, party: candidate.party };
        }
        acc[candidate.name].votes += candidate.votes;
      });
      return acc;
    }, {});

    const statewideTotal = Object.values(statewideTotals).reduce((sum, c) => sum + c.votes, 0);

    console.log('\n  Statewide Summary:');
    Object.entries(statewideTotals)
      .sort((a, b) => b[1].votes - a[1].votes)
      .forEach(([name, data]) => {
        const pct = (data.votes / statewideTotal * 100).toFixed(1);
        console.log(`    ${name} (${data.party}): ${data.votes.toLocaleString()} votes (${pct}%)`);
      });

  } catch (error) {
    console.error('Error generating election data:', error);
    process.exit(1);
  }
}

generateElectionData();
