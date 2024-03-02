// Leaderboard.tsx
import React from 'react';

interface LeaderboardProps {
  onSelectCollection: (slug: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onSelectCollection }) => (
  <div>
    {["astroguys",
      "bullsonsei",
      "cappys",
      "dob",
      "fudfoxes",
      "ghosty",
      "grapesonsei",
      "qunks",
      "remosworld",
      "seimen",
      "seimurai",
      "seitoshis",
      "seiyans",
      "thecolony",
      "thecouncil",
      "therabbitproject",
      "theunfrgtn",
      "webump",
      "yakavoyager"].map((collectionSlug) => (
      <div 
        key={collectionSlug} 
        onClick={() => onSelectCollection(collectionSlug)}
        style={{ cursor: 'pointer', padding: '10px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
      >
        {collectionSlug}
      </div>
    ))}
  </div>
);

export default Leaderboard;