
import React, { useState, useEffect } from 'react';
import BirthdayForm from './components/BirthdayForm';
import ResultDisplay from './components/ResultDisplay';
import Confetti from './components/Confetti';
import { BirthdayData, GeneratedMessage, SavedRoast } from './types';
import { generateBirthdayMessage } from './services/geminiService';

const STORAGE_KEY = 'bday_roast_favorites';

interface CardResult extends BirthdayData {
  id: string;
  text: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResults, setCurrentResults] = useState<CardResult[]>([]);
  const [savedRoasts, setSavedRoasts] = useState<SavedRoast[]>([]);

  // Load saved roasts on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedRoasts(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    }
  }, []);

  // Save to localStorage whenever savedRoasts changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRoasts));
  }, [savedRoasts]);

  const handleGenerate = async (data: BirthdayData) => {
    setIsLoading(true);
    setError(null);
    try {
      const message = await generateBirthdayMessage(data);
      const newResult: CardResult = {
        id: crypto.randomUUID(),
        ...data,
        text: message
      };
      // Prepend to show the newest at the top
      setCurrentResults(prev => [newResult, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (result: CardResult) => {
    const isAlreadySaved = savedRoasts.some(r => r.text === result.text);
    if (!isAlreadySaved) {
      const newRoast: SavedRoast = {
        ...result,
        timestamp: Date.now(),
      };
      setSavedRoasts(prev => [newRoast, ...prev]);
    }
  };

  const handleDeleteSaved = (id: string) => {
    setSavedRoasts(prev => prev.filter(r => r.id !== id));
  };

  const isSaved = (text: string) => savedRoasts.some(r => r.text === text);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-8 relative overflow-x-hidden">
      {/* Decorative Background Icons */}
      <div className="absolute top-20 left-10 text-yellow-300 opacity-20 floating text-6xl rotate-12 hidden lg:block">
        <i className="fa-solid fa-star"></i>
      </div>
      <div className="absolute bottom-20 right-10 text-pink-300 opacity-20 floating text-6xl -rotate-12 hidden lg:block">
        <i className="fa-solid fa-cake-candles"></i>
      </div>

      <Confetti />

      <header className="text-center mb-16 relative w-full max-w-6xl">
        <div className="inline-flex items-center justify-center p-6 bg-white rounded-full shadow-2xl mb-8 transform hover:scale-110 transition-transform duration-300 border-8 border-indigo-100">
          <i className="fa-solid fa-masks-theater text-6xl text-indigo-600"></i>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-fredoka font-black tracking-tighter title-shimmer drop-shadow-lg">
            THE BIRTHDAY BASHER
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <span className="h-1.5 w-12 bg-pink-500 rounded-full"></span>
            <p className="text-indigo-100 font-black uppercase tracking-[0.3em] text-sm drop-shadow-md">Spice Up Their Special Day</p>
            <span className="h-1.5 w-12 bg-yellow-400 rounded-full"></span>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COLUMN: FORM */}
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border-8 border-indigo-100/50 sticky top-12">
          <h2 className="text-3xl font-fredoka font-black text-indigo-900 mb-8 flex items-center">
            <i className="fa-solid fa-keyboard mr-3 text-pink-500"></i>
            Roast Generator
          </h2>
          
          {error && (
            <div className="mb-8 p-5 bg-red-50 border-l-8 border-red-500 text-red-700 rounded-2xl flex items-center space-x-4">
              <i className="fa-solid fa-triangle-exclamation text-xl"></i>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <BirthdayForm 
            onSubmit={handleGenerate} 
            isLoading={isLoading} 
          />

          <div className="mt-12 p-6 bg-indigo-50 rounded-3xl border-2 border-indigo-100">
            <p className="text-indigo-800 text-sm font-bold flex items-center">
              <i className="fa-solid fa-lightbulb mr-2 text-yellow-500"></i>
              Pro Tip: The weirdest hobbies get the best roasts!
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: STACKED CARDS */}
        <div className="space-y-8 min-h-[400px]">
          {currentResults.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-white/10 backdrop-blur-md rounded-[3rem] border-4 border-dashed border-white/30 text-white/50">
              <i className="fa-solid fa-box-open text-8xl mb-6 opacity-20"></i>
              <p className="text-2xl font-bold italic">No cards here yet... Fill out the form to start the roasting!</p>
            </div>
          )}

          {isLoading && currentResults.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-white rounded-[3rem] shadow-xl animate-pulse">
              <i className="fa-solid fa-wand-sparkles text-8xl mb-6 text-indigo-200"></i>
              <p className="text-2xl font-black text-indigo-200 uppercase tracking-widest">Writing the burn...</p>
            </div>
          )}

          {currentResults.map((res) => (
            <ResultDisplay 
              key={res.id}
              name={res.name}
              message={res.text}
              onSave={() => handleSave(res)}
              isSaved={isSaved(res.text)}
            />
          ))}
        </div>
      </div>

      {/* Favorites Section (Optional, kept for persistence management) */}
      {savedRoasts.length > 0 && (
        <section className="w-full max-w-7xl mt-24 px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-fredoka font-black text-white drop-shadow-md flex items-center">
              <i className="fa-solid fa-heart-circle-check text-pink-400 mr-4 animate-bounce"></i>
              The Hall of Flame
            </h2>
            <button 
              onClick={() => { if(confirm('Wipe the slate clean?')) setSavedRoasts([]); }}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-black rounded-full border border-white/20 transition-all uppercase tracking-widest"
            >
              Clear Favorites
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedRoasts.map((roast) => (
              <div 
                key={roast.id} 
                className="bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-100 hover:scale-[1.02] transition-transform relative group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-indigo-900 font-black text-xl">{roast.name}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      {roast.age} • {roast.hobby}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteSaved(roast.id)}
                    className="text-gray-200 hover:text-red-500 transition-colors p-2"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <p className="text-gray-700 font-medium italic leading-relaxed text-lg border-l-4 border-indigo-100 pl-4">
                  "{roast.text}"
                </p>
                <div className="mt-6 flex justify-between items-center">
                   <button 
                    onClick={() => navigator.clipboard.writeText(roast.text)}
                    className="text-indigo-500 hover:text-indigo-700 text-xs font-black flex items-center space-x-2"
                  >
                    <i className="fa-solid fa-copy"></i>
                    <span>COPY</span>
                  </button>
                  <span className="text-[10px] text-gray-300 font-bold uppercase">{new Date(roast.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-24 mb-12 text-center w-full">
        <div className="inline-flex items-center px-8 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/70 text-sm font-bold shadow-xl">
          <i className="fa-solid fa-sparkles text-yellow-400 mr-3"></i>
          Designed for Laughter
        </div>
      </footer>
    </div>
  );
}

export default App;
