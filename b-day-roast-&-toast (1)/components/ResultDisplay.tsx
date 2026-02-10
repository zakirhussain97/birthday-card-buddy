
import React from 'react';

interface ResultDisplayProps {
  message: string;
  name: string;
  onSave: () => void;
  isSaved: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ message, name, onSave, isSaved }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'B-Day Roast & Toast',
          text: `Check out this birthday roast for ${name}: "${message}"`,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `A spicy birthday roast for ${name}: "${message}"`
      )}`;
      window.open(twitterUrl, '_blank');
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-500 mb-8 last:mb-0">
      <div className="card-interior p-8 md:p-12 rounded-r-3xl rounded-l-md border-l-4 border-l-orange-200">
        <div className="absolute top-4 right-6 text-orange-100 text-6xl opacity-50">
          <i className="fa-solid fa-cake-candles"></i>
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="font-caveat text-3xl text-indigo-400">Dear {name},</div>
          
          <p className="text-2xl md:text-3xl text-gray-800 font-fredoka font-medium leading-relaxed drop-shadow-sm min-h-[80px]">
            {message}
          </p>

          <div className="flex justify-end pt-4">
            <div className="text-right">
              <div className="font-caveat text-2xl text-pink-500">- B-Day Roast Bot 🤖</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1">Generated with love (and spice)</div>
            </div>
          </div>
        </div>

        {/* Action Overlay/Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors text-sm font-bold"
          >
            <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={onSave}
            disabled={isSaved}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors text-sm font-bold ${
              isSaved 
                ? 'bg-yellow-100 text-yellow-700 cursor-default' 
                : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
            }`}
          >
            <i className={`fa-solid ${isSaved ? 'fa-heart' : 'fa-heart-circle-plus'}`}></i>
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors text-sm font-bold"
          >
            <i className="fa-solid fa-share-nodes"></i>
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
