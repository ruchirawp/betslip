import { useState } from 'react';

export default function BetCard({ bet, eventImage }) {
  const [flipped, setFlipped] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(bet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${bet.game?.replace(/\s+/g, '_') || 'bet'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.target.src = '/bet_default.jpg';
            }}
          />
          <div className="p-2 text-center font-semibold text-black flex-grow flex items-center justify-center text-sm">
            {bet.game || 'Event'}
          </div>
        </div>

        {/* Back */}
        {/* <div className="flip-card-back bg-white rounded-lg shadow p-2 w-full h-full overflow-auto flex flex-col justify-between"> */}
        <div className="flip-card-back bg-white text-black rounded-lg shadow p-2 w-full h-full overflow-auto flex flex-col justify-between">

          <div>
            <h2 className="font-bold text-center mb-1 text-m">{bet.game}</h2>
            <div className="text-sm space-y-0.5">
              {Object.entries(bet).map(([key, value]) => (
                value && (
                  <p key={key}>
                    <strong>{formatKey(key)}:</strong> {formatValue(value)}
                  </p>
                )
              ))}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent flip on click
              handleDownload();
            }}
            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-s font-semibold px-3 py-1 rounded shadow"
          >
            Download JSON
          </button>
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
