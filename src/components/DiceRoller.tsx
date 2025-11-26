import React, { useState } from 'react';
import { D20Icon } from './icons/D20Icon';

const DICE_TYPES = [4, 6, 8, 10, 12, 20];

const DiceRoller: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastRoll, setLastRoll] = useState<string | null>(null);

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setLastRoll(`d${sides}: ${result}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-6 bg-black/90 backdrop-blur-xl border-2 border-red-900 rounded-xl p-4 w-72 shadow-[0_0_30px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex justify-between items-center mb-4 border-b border-red-900/50 pb-2">
            <h3 className="font-medieval text-xl text-red-500 tracking-wider">Arsenal de Dados</h3>
            <button onClick={() => setLastRoll(null)} className="text-xs text-stone-500 hover:text-stone-300">Limpiar</button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {DICE_TYPES.map(sides => (
              <button
                key={sides}
                onClick={() => rollDice(sides)}
                className="group relative bg-zinc-900 text-stone-300 font-bold py-3 rounded-lg border border-zinc-700 hover:border-red-500 hover:text-white hover:shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all duration-200 flex flex-col items-center justify-center h-16"
              >
                 <span className="text-xs uppercase text-stone-600 group-hover:text-red-500 mb-1">d{sides}</span>
                 <D20Icon className="w-6 h-6 opacity-20 absolute" />
                 <span className="z-10 text-lg">Roll</span>
              </button>
            ))}
          </div>

          {lastRoll && (
            <div className="mt-4 bg-red-950/30 border border-red-900/50 rounded-lg p-3 text-center animate-pulse">
                <p className="text-2xl font-bold text-white font-medieval tracking-widest">
                   {lastRoll}
                </p>
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
            relative w-16 h-16 rounded-full flex items-center justify-center 
            bg-gradient-to-br from-red-900 to-black border-2 border-red-600 
            shadow-[0_0_25px_rgba(220,38,38,0.6)] 
            hover:scale-110 hover:shadow-[0_0_35px_rgba(220,38,38,0.8)]
            transition-all duration-300 group
            ${isOpen ? 'rotate-180' : 'animate-float'}
        `}
        aria-label="Toggle Dice Roller"
      >
        <div className="absolute inset-0 rounded-full bg-red-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <D20Icon className="w-8 h-8 text-white drop-shadow-md" />
      </button>
    </div>
  );
};

export default DiceRoller;