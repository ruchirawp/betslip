import { useState } from 'react';
import './BetCard.css';

export default function BetCard({ bet, eventImage }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flip-card cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <div className={`flip-card-inner ${flipped ? 'flipped' : ''} h-80`}> {/* Taller inner card */}
        
        {/* Front */}
        <div className="flip-card-front bg-gray-100 rounded-lg shadow overflow-hidden h-80 flex flex-col">
          <img
            src={eventImage}
            alt="Event"
            className="w-full h-48 object-cover"
          />
          <div className="p-2 text-center font-semibold flex-grow flex items-center justify-center">
            {bet.game || 'Event'}
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back bg-white rounded-lg shadow p-4 h-80 overflow-auto">
          <h3 className="font-bold text-center mb-2">{bet.game}</h3>
          <div className="text-sm space-y-1">
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
