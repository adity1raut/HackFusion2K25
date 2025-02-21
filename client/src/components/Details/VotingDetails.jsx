import React, { useState, useEffect } from 'react';

const VotingDetails = () => {
  const [elections, setElections] = useState({
    'Technical Secretary': { candidates: [], hasVoted: false, selectedCandidate: null },
    'General Secretary': { candidates: [], hasVoted: false, selectedCandidate: null },
    'Sport Secretary': { candidates: [], hasVoted: false, selectedCandidate: null },
    'Cultural Secretary': { candidates: [], hasVoted: false, selectedCandidate: null },
    'Girls Representative': { candidates: [], hasVoted: false, selectedCandidate: null }
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/election-candidates');
        const data = await response.json();

        const newElections = { ...elections };
        data.forEach((candidate) => {
          if (newElections[candidate.position]) {
            newElections[candidate.position].candidates.push(candidate);
          }
        });

        setElections(newElections);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  const handleVote = async (position, candidate) => {
    const election = elections[position];

    try {
      const response = await fetch('http://localhost:4000/api/election-candidates/vote', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo: candidate.regNo })
      });

      if (!response.ok) {
        throw new Error('Failed to update vote');
      }

      // Update local state
      setElections(prev => ({
        ...prev,
        [position]: {
          ...prev[position],
          candidates: prev[position].candidates.map(c => {
            if (c.regNo === candidate.regNo) {
              return { ...c, votes: c.votes + 1 };
            }
            return c;
          }),
          hasVoted: true,
          selectedCandidate: candidate.regNo
        }
      }));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const CandidateGrid = ({ candidates, hasVoted, selectedCandidate, position }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {candidates.map((candidate) => {
        // Check if voting should be disabled
        const isVotingDisabled = 
          (hasVoted && selectedCandidate !== candidate.regNo); // Only disable if the user has voted for this specific position

        return (
          <div
            key={candidate.regNo}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
              selectedCandidate === candidate.regNo ? 'ring-2 ring-indigo-500' : ''
            }`}
          >
            <div className="relative">
              <img
                src={candidate.image || '/api/placeholder/400/300'}
                alt={`${candidate.name}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <h3 className="text-lg font-bold text-white mb-1">{candidate.name}</h3>
                <p className="text-sm text-white/90">{candidate.branch} - {candidate.year} year</p>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <h4 className="text-sm font-bold text-indigo-600 mb-2">Candidate Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 uppercase tracking-wider text-xs">Registration</p>
                      <p className="font-semibold text-gray-900">{candidate.regNo}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase tracking-wider text-xs">Branch</p>
                      <p className="font-semibold text-gray-900">{candidate.branch}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase tracking-wider text-xs">Year</p>
                    <p className="font-semibold text-gray-900">{candidate.year}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleVote(position, candidate)}
                    disabled={isVotingDisabled}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                      ${
                        isVotingDisabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 hover:scale-105'
                      }
                    `}
                  >
                    {selectedCandidate === candidate.regNo 
                      ? 'Voted' 
                      : hasVoted 
                        ? 'Voting Locked' 
                        : 'Vote'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-20 space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Elections Dashboard</h1>
          <p className="text-lg text-gray-600">Cast your vote for student representatives</p>
        </div>

        {Object.entries(elections).map(([position, election]) => (
          <div key={position}>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-2">{position}</h2>
              <p className="text-base text-gray-600">Vote for your {position}</p>
            </div>

            {election.hasVoted && (
              <div className="mb-4 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                <p className="text-sm font-semibold text-indigo-800">
                  Thank you for voting in the {position} Election!
                </p>
              </div>
            )}

            <CandidateGrid
              candidates={election.candidates}
              hasVoted={election.hasVoted}
              selectedCandidate={election.selectedCandidate}
              position={position}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingDetails;