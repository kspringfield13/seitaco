// Leaderboard.tsx
import React from 'react';

const collectionNamesMapping: Record<string, string> = {
  astroguys: "Astro Guys",
  bullsonsei: "Bulls on SEI",
  cappys: "Cappys",
  cryptomonos: "CryptoMonos",
  dob: "dob",
  fudfoxes: "Fud Foxes",
  ghosty: "Ghosty",
  grapesonsei: "Grapes on Sei",
  qunks: "QUNKS",
  remosworld: "REMO's World",
  seimen: "SEIMEN",
  seimurai: "Seimurai",
  seitoshis: "Seitoshis",
  seiyans: "Seiyans",
  thecolony: "The Colony",
  thecouncil: "The Council",
  therabbitproject: "The Rabbit Project",
  theunfrgtn: "The Unfrgtn",
  webump: "WeBump",
  yakavoyager: "Yaka Voyager",
};

interface LeaderboardProps {
  onSelectCollection: (slug: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onSelectCollection }) => (
  <div>
    {Object.entries(collectionNamesMapping).map(([collectionSlug, collectionName]) => (
      <div 
        key={collectionSlug} 
        onClick={() => onSelectCollection(collectionSlug)}
        style={{ cursor: 'pointer', padding: '10px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
      >
        {collectionName}
      </div>
    ))}
  </div>
);

export default Leaderboard;