'use client';

import { useMapStore } from '@/store/mapStore';
import { formatNumber, formatCurrency, formatPercent, formatDensity } from '@/utils/formatters';
import { useElectionData } from '@/hooks/useElectionData';
import { PARTY_COLORS } from '@/utils/colorScale';

export function Sidebar() {
  const { selectedCounty, hoveredCounty, dataOverlay } = useMapStore();
  const { getElectionByFips } = useElectionData();

  const displayCounty = selectedCounty || hoveredCounty;
  const demographics = displayCounty?.properties?.demographics;
  const electionResults = displayCounty?.properties?.FIPS ?
    getElectionByFips(displayCounty.properties.FIPS) : undefined;

  if (!displayCounty) {
    return (
      <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Arizona Counties</h2>
        <p className="text-gray-600">
          Hover over or click on a county to view its demographic information.
        </p>
        <div className="mt-6 text-sm text-gray-500">
          <p className="font-semibold mb-2">Available Data:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Total Population</li>
            <li>Median Household Income</li>
            <li>Age Distribution</li>
            <li>Population Density</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {displayCounty.properties.NAME} County
          </h2>
          {selectedCounty && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Selected
            </span>
          )}
        </div>
      </div>

      {!demographics ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-semibold">Data Unavailable</p>
          <p className="text-yellow-600 text-sm mt-1">
            Demographic data for this county is not available.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Population */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Population
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {formatNumber(demographics.population)}
            </p>
            {demographics.populationDensity !== undefined && (
              <p className="text-sm text-gray-600 mt-1">
                {formatDensity(demographics.populationDensity)}
              </p>
            )}
          </div>

          {/* Income */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Median Household Income
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {formatCurrency(demographics.medianIncome)}
            </p>
          </div>

          {/* Age Distribution */}
          {demographics.ageDistribution && (
            <div className="border-b pb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Age Distribution
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Under 18</span>
                    <span className="font-semibold text-gray-800">
                      {formatPercent(demographics.ageDistribution.under18, demographics.population)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(demographics.ageDistribution.under18 / demographics.population) * 100}%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">18 to 64</span>
                    <span className="font-semibold text-gray-800">
                      {formatPercent(demographics.ageDistribution.age18to64, demographics.population)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(demographics.ageDistribution.age18to64 / demographics.population) * 100}%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">65 and Over</span>
                    <span className="font-semibold text-gray-800">
                      {formatPercent(demographics.ageDistribution.age65Plus, demographics.population)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${(demographics.ageDistribution.age65Plus / demographics.population) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {demographics.housingUnits !== undefined && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Housing Units
              </h3>
              <p className="text-xl font-semibold text-gray-800">
                {formatNumber(demographics.housingUnits)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Election Results */}
      {electionResults && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">2024 Presidential Election</h3>

          <div className="space-y-4">
            {/* Winner */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Winner</span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PARTY_COLORS[electionResults.winnerParty] }}
                />
              </div>
              <p className="text-xl font-bold text-gray-900">{electionResults.winner}</p>
              <p className="text-sm text-gray-600">{electionResults.winnerParty}</p>
              <p className="text-xs text-gray-500 mt-1">
                Margin: {electionResults.margin.toFixed(1)}%
              </p>
            </div>

            {/* Results by Candidate */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Results
              </h4>
              <div className="space-y-2">
                {electionResults.candidates
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: PARTY_COLORS[candidate.party] }}
                        />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {candidate.name}
                        </span>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-sm font-semibold text-gray-900">
                          {candidate.percentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(candidate.votes)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Turnout */}
            {electionResults.turnoutPercentage && (
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Voter Turnout</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {electionResults.turnoutPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatNumber(electionResults.totalVotes)} of{' '}
                  {formatNumber(electionResults.registeredVoters || 0)} registered
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedCounty && (
        <button
          onClick={() => useMapStore.getState().setSelectedCounty(null)}
          className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
        >
          Clear Selection
        </button>
      )}
    </div>
  );
}
