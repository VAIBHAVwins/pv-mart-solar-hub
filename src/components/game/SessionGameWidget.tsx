
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface GamePanel {
  id: number;
  x: number;
  y: number;
  efficiency: number;
}

interface GameStats {
  score: number;
  energy: number;
  panels: GamePanel[];
  time: number;
  isPlaying: boolean;
  highScore: number;
}

const SessionGameWidget = () => {
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    energy: 0,
    panels: [],
    time: 0,
    isPlaying: false,
    highScore: 0
  });

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    // Load high score from session storage
    const savedHighScore = sessionStorage.getItem('solarGameHighScore');
    if (savedHighScore) {
      setGameStats(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStats.isPlaying) {
      interval = setInterval(() => {
        setGameStats(prev => {
          const totalEnergy = prev.panels.reduce((sum, panel) => sum + panel.efficiency, 0);
          const newEnergy = prev.energy + totalEnergy;
          const newScore = prev.score + totalEnergy;
          const newTime = prev.time + 1;

          // Update high score if needed
          let newHighScore = prev.highScore;
          if (newScore > prev.highScore) {
            newHighScore = newScore;
            sessionStorage.setItem('solarGameHighScore', newScore.toString());
          }

          return {
            ...prev,
            time: newTime,
            energy: newEnergy,
            score: newScore,
            highScore: newHighScore
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStats.isPlaying, gameStats.panels]);

  const addPanel = () => {
    if (gameStats.panels.length < 10) {
      const newPanel: GamePanel = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        efficiency: Math.random() * 50 + 50
      };
      setGameStats(prev => ({
        ...prev,
        panels: [...prev.panels, newPanel]
      }));
    }
  };

  const removePanel = (id: number) => {
    setGameStats(prev => ({
      ...prev,
      panels: prev.panels.filter(panel => panel.id !== id)
    }));
  };

  const startGame = () => {
    setGameStats(prev => ({
      ...prev,
      isPlaying: true,
      time: 0,
      energy: 0,
      score: 0,
      panels: []
    }));
  };

  const stopGame = async () => {
    // Save game score temporarily
    try {
      await supabase.from('temp_game_scores').insert({
        score: gameStats.score,
        energy_generated: gameStats.energy,
        panels_placed: gameStats.panels.length,
        game_duration: gameStats.time,
        session_id: sessionId
      });
    } catch (error) {
      console.log('Could not save temp score:', error);
    }

    setGameStats(prev => ({
      ...prev,
      isPlaying: false
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-solar-primary">
          Solar Panel Game
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Game Stats */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-solar-primary">{Math.round(gameStats.score)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">High Score</p>
            <p className="text-2xl font-bold text-solar-secondary">{Math.round(gameStats.highScore)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Energy Generated</p>
            <p className="text-2xl font-bold text-green-600">{Math.round(gameStats.energy)} kWh</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Time</p>
            <p className="text-2xl font-bold text-gray-700">{gameStats.time}s</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Panels</p>
            <p className="text-2xl font-bold text-blue-600">{gameStats.panels.length}/10</p>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {!gameStats.isPlaying ? (
            <Button onClick={startGame} className="bg-solar-primary hover:bg-solar-secondary">
              Start Game
            </Button>
          ) : (
            <Button onClick={stopGame} className="bg-gray-600 hover:bg-gray-700">
              Stop Game
            </Button>
          )}
          {gameStats.isPlaying && (
            <Button 
              onClick={addPanel} 
              disabled={gameStats.panels.length >= 10} 
              className="bg-green-600 hover:bg-green-700"
            >
              Add Solar Panel ({10 - gameStats.panels.length} left)
            </Button>
          )}
        </div>

        {/* Game Area */}
        <div className="relative bg-gradient-to-b from-blue-100 to-yellow-100 rounded-lg h-96 border-2 border-solar-primary overflow-hidden">
          {gameStats.panels.map(panel => (
            <div
              key={panel.id}
              className="absolute w-8 h-8 bg-yellow-400 border-2 border-orange-500 rounded cursor-pointer hover:bg-yellow-300 transition-colors"
              style={{
                left: `${panel.x}%`,
                top: `${panel.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => gameStats.isPlaying && removePanel(panel.id)}
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
          {gameStats.panels.length === 0 && gameStats.isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-700 text-lg font-semibold bg-white bg-opacity-80 px-4 py-2 rounded">
                Click "Add Solar Panel" to place panels!
              </p>
            </div>
          )}

          {!gameStats.isPlaying && gameStats.panels.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-700 text-lg font-semibold bg-white bg-opacity-80 px-4 py-2 rounded">
                Click "Start Game" to begin playing!
              </p>
            </div>
          )}
        </div>

        {/* Game Instructions */}
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click "Start Game" to begin</li>
            <li>• Add solar panels by clicking "Add Solar Panel"</li>
            <li>• Click on panels to remove them</li>
            <li>• Each panel generates energy based on its efficiency</li>
            <li>• Try to maximize your energy generation!</li>
            <li>• Your high score is saved for this session</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionGameWidget;
