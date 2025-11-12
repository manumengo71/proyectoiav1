import React, { useState } from 'react';
import { D20Icon } from './icons/D20Icon';

const DICE_TYPES = [4, 6, 8, 10, 12, 20];

const DiceRoller: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastRoll, setLastRoll] = useState<string | null>(null);

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setLastRoll(`1d${sides} ➞ ${result}`);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {isOpen && (
        <div className="bg-parchment rounded-lg shadow-2xl p-4 border-2 border-amber-900/50 w-64 mb-4 transition-all duration-300 ease-in-out transform origin-bottom-right">
          <h3 className="text-center font-medieval text-xl text-stone-800 mb-3">Lanzar Dados</h3>
          <div className="grid grid-cols-3 gap-2">
            {DICE_TYPES.map(sides => (
              <button
                key={sides}
                onClick={() => rollDice(sides)}
                className="bg-amber-800/80 text-white font-bold py-2 rounded-md hover:bg-amber-700 transition-colors duration-200 border border-amber-900/50"
              >
                d{sides}
              </button>
            ))}
          </div>
          {lastRoll && (
            <p className="text-center mt-4 text-lg font-bold text-stone-800 bg-white/30 rounded-md p-2">
              {lastRoll}
            </p>
          )}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-800 text-white rounded-full p-4 shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-amber-500 transition-all duration-200 transform hover:scale-110"
        aria-label="Toggle Dice Roller"
      >
        <D20Icon />
      </button>
    </div>
  );
};

export default DiceRoller;