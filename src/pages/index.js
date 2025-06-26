import { useState } from 'react';
import Tesseract from 'tesseract.js';
import UploadArea from '../components/UploadArea';
import BetCard from '../components/BetCard';
import parseWithOpenAI from '../utils/parseWithOpenAI';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function Home() {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!image) return;
    setLoading(true);

    const { data: { text } } = await Tesseract.recognize(image, 'eng');
    setOcrText(text);

    const parsed = await parseWithOpenAI(text);
    setBets(parsed);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow">
        <div className="max-w-4xl mx-auto text-xl font-bold">
          Bet Screenshot Parser
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <UploadArea setImage={setImage} />

          {image && (
            <>
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded preview"
                className="w-full max-w-sm mx-auto my-4 rounded shadow"
              />

              <button
                onClick={handleParse}
                className={`w-full py-2 rounded text-white font-semibold ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                disabled={loading}
              >
                {loading ? 'Parsing...' : 'Parse Bet'}
              </button>
            </>
          )}
        </div>

        {bets.length > 0 && (
          <div className="mt-6">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-6"
            >
              {bets.map((bet, idx) => (
                <SwiperSlide key={idx}>
                  <BetCard bet={bet} eventImage={getEventImage(bet)} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-4">
        © 2025 BetParser — All rights reserved
      </footer>
    </div>
  );
}

async function getEventImage(bet) {

//ruchira
console.log('getEventImage called with bet:', bet);

  if (!bet || !bet.side) {
    return 'https://via.placeholder.com/300x150?text=$';
  }

  const teamName = bet.side;

  try {

    //ruchira
    console.log(`Fetching image for team: ${teamName}`);

    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(teamName)}`);
    const data = await res.json();

      //ruchira
    console.log('API response:', data);

    if (data.teams && data.teams.length > 0) {
      const team = data.teams[0];

      // Prioritize fanart1 > banner > badge > logo
      return (
        team.strFanart1 ||
        team.strBanner ||
        team.strBadge ||
        team.strLogo ||
        'https://via.placeholder.com/300x150?text=$'
      );
    }
  } catch (e) {
    console.error('Failed to fetch team image:', e);
  }

  return 'https://via.placeholder.com/300x150?text=$';
}
