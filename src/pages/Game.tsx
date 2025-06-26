import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// CURSOR AI: Solar Game Page - Interactive solar panel placement game
export default function Game() {
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [panels, setPanels] = useState<Array<{id: number, x: number, y: number, efficiency: number}>>([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
        // Generate energy based on number of panels and their efficiency
        const totalEnergy = panels.reduce((sum, panel) => sum + panel.efficiency, 0);
        setEnergy(prev => prev + totalEnergy);
        setScore(prev => prev + totalEnergy);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, panels]);

  const addPanel = () => {
    if (panels.length < 10) {
      const newPanel = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // Random position
        y: Math.random() * 80 + 10,
        efficiency: Math.random() * 50 + 50 // Random efficiency 50-100%
      };
      setPanels(prev => [...prev, newPanel]);
    }
  };

  const removePanel = (id: number) => {
    setPanels(prev => prev.filter(panel => panel.id !== id));
  };

  const startGame = () => {
    setIsPlaying(true);
    setTime(0);
    setEnergy(0);
    setScore(0);
    setPanels([]);
  };

  const stopGame = () => {
    setIsPlaying(false);
  };

  return (
    <Layout>
      {/* CURSOR AI: Hero Section */}
      <section className="relative text-white py-20 bg-gradient-to-br from-[#589bee] via-[#5279ac] to-[#444e59] flex items-center justify-center min-h-[40vh]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Solar Energy Game</h1>
          <p className="text-lg mb-6 opacity-90 max-w-xl mx-auto">Place solar panels strategically to maximize energy generation! Learn how panel placement affects efficiency.</p>
          <Link to="/">
            <Button className="bg-[#fecb00] text-[#190a02] hover:bg-[#ffe066] font-bold shadow-md">Back to Home</Button>
          </Link>
        </div>
      </section>

      {/* CURSOR AI: Game Section */}
      <section className="py-20 bg-[#f6fafd]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            {/* Game Controls */}
            <div className="flex flex-wrap gap-4 mb-6 justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-2xl font-bold text-[#589bee]">{Math.round(score)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Energy Generated</p>
                <p className="text-2xl font-bold text-[#fecb00]">{Math.round(energy)} kWh</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-2xl font-bold text-[#444e59]">{time}s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Panels</p>
                <p className="text-2xl font-bold text-[#5279ac]">{panels.length}/10</p>
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex flex-wrap gap-4 mb-6 justify-center">
              {!isPlaying ? (
                <Button onClick={startGame} className="bg-[#589bee] hover:bg-[#5279ac]">
                  Start Game
                </Button>
              ) : (
                <Button onClick={stopGame} className="bg-[#444e59] hover:bg-[#373f47]">
                  Stop Game
                </Button>
              )}
              {isPlaying && (
                <Button onClick={addPanel} disabled={panels.length >= 10} className="bg-[#fecb00] text-[#190a02] hover:bg-[#f8b200]">
                  Add Solar Panel
                </Button>
              )}
            </div>

            {/* Game Area */}
            <div className="relative bg-gradient-to-b from-blue-100 to-yellow-100 rounded-lg h-96 border-2 border-[#589bee] overflow-hidden">
              {panels.map(panel => (
                <div
                  key={panel.id}
                  className="absolute w-8 h-8 bg-yellow-400 border-2 border-orange-500 rounded cursor-pointer hover:bg-yellow-300 transition-colors"
                  style={{
                    left: `${panel.x}%`,
                    top: `${panel.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => isPlaying && removePanel(panel.id)}
                  title={`Efficiency: ${Math.round(panel.efficiency)}%`}
                >
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-orange-800">
                    ☀️
                  </div>
                </div>
              ))}
              
              {/* Sun */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse">
                <div className="w-full h-full flex items-center justify-center text-2xl">☀️</div>
              </div>

              {/* Instructions */}
              {panels.length === 0 && isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#444e59] text-lg font-semibold bg-white bg-opacity-80 px-4 py-2 rounded">
                    Click "Add Solar Panel" to place panels!
                  </p>
                </div>
              )}
            </div>

            {/* Game Instructions */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-[#444e59] mb-2">How to Play:</h3>
              <ul className="text-sm text-[#7c8a9e] space-y-1">
                <li>• Click "Start Game" to begin</li>
                <li>• Add solar panels by clicking "Add Solar Panel"</li>
                <li>• Click on panels to remove them</li>
                <li>• Each panel generates energy based on its efficiency</li>
                <li>• Try to maximize your energy generation!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 