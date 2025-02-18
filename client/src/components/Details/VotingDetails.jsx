import React, { useState } from 'react';

const VotingDetails = () => {
  const [gsElection, setGsElection] = useState({
    candidates: [
      { 
        id: 1, 
        name: 'John Smith', 
        party: 'Progressive Party', 
        votes: 230, 
        details: '15 years of public service',
        age: 45,
        qualification: 'PhD in Public Policy',
        constituency: 'North District'
      },
      { 
        id: 2, 
        name: 'Sarah Johnson', 
        party: 'Reform Party', 
        votes: 180, 
        details: 'Former City Council Member',
        age: 38,
        qualification: 'Masters in Political Science',
        constituency: 'South District'
      },
      { 
        id: 3, 
        name: 'Robert Lee', 
        party: 'Unity Party', 
        votes: 150, 
        details: 'Community Leader',
        age: 42,
        qualification: 'Masters in Public Admin',
        constituency: 'West District'
      },
      { 
        id: 4, 
        name: 'Lisa Chen', 
        party: 'Forward Party', 
        votes: 165, 
        details: 'Education Advocate',
        age: 39,
        qualification: 'PhD in Education',
        constituency: 'Central District'
      }
    ],
    hasVoted: false,
    selectedCandidate: null
  });

  const [csElection, setCsElection] = useState({
    candidates: [
      { 
        id: 1, 
        name: 'Michael Brown', 
        party: 'Unity Party', 
        votes: 150, 
        details: 'Business Leader',
        age: 52,
        qualification: 'MBA',
        constituency: 'East District'
      },
      { 
        id: 2, 
        name: 'Emma Wilson', 
        party: 'Development Party', 
        votes: 165, 
        details: 'Tech Expert',
        age: 41,
        qualification: 'MSc in CS',
        constituency: 'West District'
      },
      { 
        id: 3, 
        name: 'David Park', 
        party: 'Culture Party', 
        votes: 145, 
        details: 'Arts Director',
        age: 38,
        qualification: 'MA in Arts',
        constituency: 'South District'
      },
      { 
        id: 4, 
        name: 'Anna Martinez', 
        party: 'Creative Party', 
        votes: 155, 
        details: 'Event Manager',
        age: 36,
        qualification: 'BFA',
        constituency: 'North District'
      }
    ],
    hasVoted: false,
    selectedCandidate: null
  });

  const [tsElection, setTsElection] = useState({
    candidates: [
      { 
        id: 1, 
        name: 'Alex Turner', 
        party: 'Tech Party', 
        votes: 175, 
        details: 'Technology Innovator',
        age: 34,
        qualification: 'MSc in Technology',
        constituency: 'East District'
      },
      { 
        id: 2, 
        name: 'Maria Garcia', 
        party: 'Digital Party', 
        votes: 160, 
        details: 'Digital Strategist',
        age: 39,
        qualification: 'Masters in Digital Media',
        constituency: 'West District'
      },
      { 
        id: 3, 
        name: 'James Wilson', 
        party: 'Innovation Party', 
        votes: 140, 
        details: 'Research Lead',
        age: 41,
        qualification: 'PhD in Computer Science',
        constituency: 'North District'
      },
      { 
        id: 4, 
        name: 'Sophie Chen', 
        party: 'Future Party', 
        votes: 155, 
        details: 'AI Researcher',
        age: 36,
        qualification: 'PhD in AI',
        constituency: 'South District'
      }
    ],
    hasVoted: false,
    selectedCandidate: null
  });
  
  const handleVote = (electionType, candidateId) => {
    const electionMap = {
      'GS': [gsElection, setGsElection],
      'CS': [csElection, setCsElection],
      'TS': [tsElection, setTsElection]
    };

    const [election, setElection] = electionMap[electionType];

    if (!election.hasVoted) {
      setElection({
        ...election,
        candidates: election.candidates.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, votes: candidate.votes + 1 }
            : candidate
        ),
        hasVoted: true,
        selectedCandidate: candidateId
      });
    }
  };

  const CandidateGrid = ({ candidates, hasVoted, selectedCandidate, electionType }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {candidates.map((candidate) => (
        <div 
          key={candidate.id} 
          className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
            selectedCandidate === candidate.id ? 'ring-2 ring-indigo-500' : ''
          }`}
        >
          <div className="relative">
            <img 
              src="/api/placeholder/400/300"
              alt={`${candidate.name}`}
              className="w-full h-40 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <h3 className="text-lg font-bold text-white mb-1">{candidate.name}</h3>
              <p className="text-sm text-white/90">{candidate.party}</p>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">{candidate.details}</p>
              
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-bold text-indigo-600 mb-2">{electionType} Candidate Profile</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 uppercase tracking-wider text-xs">Age</p>
                    <p className="font-semibold text-gray-900">{candidate.age} years</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase tracking-wider text-xs">Constituency</p>
                    <p className="font-semibold text-gray-900">{candidate.constituency}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-xs">Qualification</p>
                  <p className="font-semibold text-gray-900 text-sm">{candidate.qualification}</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => handleVote(electionType, candidate.id)}
                  disabled={hasVoted}
                  className={`
                    px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                    ${hasVoted 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 hover:scale-105'
                    }
                  `}
                >
                  Vote
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-20 space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Student Elections Dashboard
          </h1>
          <p className="text-lg text-gray-600">Cast your vote for GS, CS, and TS representatives</p>
        </div>

        {/* GS Election Section */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">GS Election</h2>
            <p className="text-base text-gray-600">Vote for your General Secretary</p>
          </div>
          
          {gsElection.hasVoted && (
            <div className="mb-4 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-indigo-800">Thank you for voting in the GS Election!</p>
            </div>
          )}
          
          <CandidateGrid 
            candidates={gsElection.candidates}
            hasVoted={gsElection.hasVoted}
            selectedCandidate={gsElection.selectedCandidate}
            electionType="GS"
          />
        </div>

        {/* CS Election Section */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">CS Election</h2>
            <p className="text-base text-gray-600">Vote for your Cultural Secretary</p>
          </div>
          
          {csElection.hasVoted && (
            <div className="mb-4 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-indigo-800">Thank you for voting in the CS Election!</p>
            </div>
          )}
          
          <CandidateGrid 
            candidates={csElection.candidates}
            hasVoted={csElection.hasVoted}
            selectedCandidate={csElection.selectedCandidate}
            electionType="CS"
          />
        </div>

        {/* TS Election Section */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">TS Election</h2>
            <p className="text-base text-gray-600">Vote for your Technical Secretary</p>
          </div>
          
          {tsElection.hasVoted && (
            <div className="mb-4 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-indigo-800">Thank you for voting in the TS Election!</p>
            </div>
          )}
          
          <CandidateGrid 
            candidates={tsElection.candidates}
            hasVoted={tsElection.hasVoted}
            selectedCandidate={tsElection.selectedCandidate}
            electionType="TS"
          />
        </div>
      </div>
    </div>
  );
};

export default VotingDetails;