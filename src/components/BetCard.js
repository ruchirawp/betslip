import { useState } from 'react';
import './BetCard.css';

export default function BetCard({ bet, eventImage }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="flip-card cursor-pointer w-64 h-96 mx-auto"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`flip-card-inner ${flipped ? 'flipped' : ''} w-full h-full`}>
        
        {/* Front */}
        <div className="flip-card-front bg-gray-100 rounded-lg shadow overflow-hidden w-full h-full flex flex-col">
          <img
            src={eventImage}
            alt={bet.game || 'Event'}
            className="w-full h-40 object-cover"
            onError={(e) => {
              e.target.src = '/bet_default.jpg';
            }}
          />
          <div className="p-2 text-center font-semibold flex-grow flex items-center justify-center text-sm">
            {bet.game || 'Event'}
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back bg-white rounded-lg shadow p-2 w-full h-full overflow-auto">
          <h3 className="font-bold text-center mb-1 text-sm">{bet.game}</h3>
          <div className="text-xs space-y-0.5">
            {Object.entries(bet).map(([key, value]) => (
              value && (
                <p key={key}>
                  <strong>{formatKey(key)}:</strong> {formatValue(value)}
                </p>
              )
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}
