import { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import UploadArea from '../components/UploadArea';
import BetCard from '../components/BetCard';
import parseWithOpenAI from '../utils/parseWithOpenAI';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function Home() {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [bets, setBets] = useState([]);
  const [betImages, setBetImages] = useState([]);
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

  useEffect(() => {
    async function loadImages() {
      const results = await Promise.all(
        bets.map(async (bet) => ({
          bet,
          image: '/betlogo.png' // fallback static image
        }))
      );
      setBetImages(results);
    }

    if (bets.length > 0) {
      loadImages();
    }
  }, [bets]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#40a0dc] text-white p-3 shadow">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <img
            src="/betbanner.svg"
            alt="Betstamp Logo"
            className="h-10 sm:h-12 mb-2"
          />
          <h1 className="text-lg sm:text-xl font-semibold">Bet Screenshot Parser</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <UploadArea setImage={setImage} />

          {image && (
            <>
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded preview"
                className="w-48 max-w-sm mx-auto my-4 rounded shadow"
              />

              <button
                onClick={handleParse}
                className={`w-full py-2 rounded text-white font-semibold ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f97315] hover:bg-orange-600'
                }`}
                disabled={loading}
              >
                {loading ? 'Parsing...' : 'Parse Bet'}
              </button>
            </>
          )}
        </div>

        {betImages.length > 0 && (
          <div className="mt-6">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              navigation={true}
              modules={[Navigation]}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-6"
            >
              {betImages.map(({ bet, image }, idx) => (
                <SwiperSlide key={idx}>
                  <BetCard bet={bet} eventImage={image} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </main>
    </div>
  );
}
