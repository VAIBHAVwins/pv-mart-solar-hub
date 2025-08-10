
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Sun, Cloud, CloudRain, Zap, Trophy, RotateCcw, Play, Pause } from 'lucide-react';

interface GameState {
  score: number;
  energy: number;
  targetEnergy: number;
  panelsPlaced: number;
  weather: 'sunny' | 'cloudy' | 'rainy';
  timeLeft: number;
  isPlaying: boolean;
  gameCompleted: boolean;
  level: number;
}

interface Panel {
  id: string;
  x: number;
  y: number;
  efficiency: number;
}

const WEATHER_EFFECTS = {
  sunny: { multiplier: 1.0, icon: Sun, color: 'text-yellow-500' },
  cloudy: { multiplier: 0.6, icon: Cloud, color: 'text-gray-500' },
  rainy: { multiplier: 0.3, icon: CloudRain, color: 'text-blue-500' }
};

const GRID_SIZE = 8;
const GAME_DURATION = 120; // 2 minutes

const EnhancedSolarGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    energy: 0,
    targetEnergy: 500,
    panelsPlaced: 0,
    weather: 'sunny',
    timeLeft: GAME_DURATION,
    isPlaying: false,
    gameCompleted: false,
    level: 1
  });

  const [panels, setPanels] = useState<Panel[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  // Generate random session ID for game tracking
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying && gameState.timeLeft > 0 && !gameState.gameCompleted) {
      interval = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          
          // Check if game should end
          if (newTimeLeft <= 0 || prev.energy >= prev.targetEnergy) {
            return {
              ...prev,
              timeLeft: Math.max(0, newTimeLeft),
              isPlaying: false,
              gameCompleted: true
            };
          }
          
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPlaying, gameState.timeLeft, gameState.gameCompleted]);

  // Energy generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying && panels.length > 0) {
      interval = setInterval(() => {
        const weatherMultiplier = WEATHER_EFFECTS[gameState.weather].multiplier;
        const energyGenerated = panels.reduce((total, panel) => {
          return total + (panel.efficiency * weatherMultiplier * 0.5);
        }, 0);

        setGameState(prev => ({
          ...prev,
          energy: prev.energy + energyGenerated,
          score: prev.score + Math.floor(energyGenerated * 10)
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPlaying, panels, gameState.weather]);

  // Weather changes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying) {
      interval = setInterval(() => {
        const weathers: Array<'sunny' | 'cloudy' | 'rainy'> = ['sunny', 'cloudy', 'rainy'];
        const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
        setGameState(prev => ({ ...prev, weather: randomWeather }));
      }, 15000); // Change weather every 15 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPlaying]);

  // Save game score when game completes
  useEffect(() => {
    if (gameState.gameCompleted && gameState.score > 0) {
      saveGameScore();
    }
  }, [gameState.gameCompleted]);

  const saveGameScore = async () => {
    try {
      const { error } = await supabase
        .from('temp_game_scores')
        .insert({
          session_id: sessionId,
          score: gameState.score,
          energy_generated: gameState.energy,
          panels_placed: gameState.panelsPlaced,
          game_duration: GAME_DURATION - gameState.timeLeft
        });

      if (error) {
        console.error('Error saving game score:', error);
      }
    } catch (err) {
      console.error('Failed to save game score:', err);
    }
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gameCompleted: false
    }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      energy: 0,
      targetEnergy: 500 + (gameState.level - 1) * 200,
      panelsPlaced: 0,
      weather: 'sunny',
      timeLeft: GAME_DURATION,
      isPlaying: false,
      gameCompleted: false,
      level: gameState.level
    });
    setPanels([]);
    setSelectedPanel(null);
  };

  const nextLevel = () => {
    setGameState(prev => ({
      score: prev.score,
      energy: 0,
      targetEnergy: 500 + prev.level * 200,
      panelsPlaced: 0,
      weather: 'sunny',
      timeLeft: GAME_DURATION,
      isPlaying: false,
      gameCompleted: false,
      level: prev.level + 1
    }));
    setPanels([]);
    setSelectedPanel(null);
  };

  const placePanelOnGrid = (gridX: number, gridY: number) => {
    if (!gameState.isPlaying || gameState.gameCompleted) return;
    
    // Check if position is already occupied
    const isOccupied = panels.some(panel => panel.x === gridX && panel.y === gridY);
    if (isOccupied) return;

    const newPanel: Panel = {
      id: `panel-${Date.now()}-${gridX}-${gridY}`,
      x: gridX,
      y: gridY,
      efficiency: 50 + Math.random() * 50 // Random efficiency between 50-100%
    };

    setPanels(prev => [...prev, newPanel]);
    setGameState(prev => ({
      ...prev,
      panelsPlaced: prev.panelsPlaced + 1,
      score: prev.score + 10
    }));
  };

  const removePanelFromGrid = (panelId: string) => {
    if (!gameState.isPlaying || gameState.gameCompleted) return;
    
    setPanels(prev => prev.filter(panel => panel.id !== panelId));
    setGameState(prev => ({
      ...prev,
      panelsPlaced: Math.max(0, prev.panelsPlaced - 1),
      score: Math.max(0, prev.score - 5)
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentWeather = WEATHER_EFFECTS[gameState.weather];
  const WeatherIcon = currentWeather.icon;
  const energyProgress = (gameState.energy / gameState.targetEnergy) * 100;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Game Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              Solar Energy Challenge - Level {gameState.level}
            </span>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-lg px-3 py-1">
                Score: {gameState.score}
              </Badge>
              <Badge variant="outline" className="text-lg px-3 py-1">
                Time: {formatTime(gameState.timeLeft)}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Energy Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Energy Generated</span>
                <span>{Math.floor(gameState.energy)} / {gameState.targetEnergy} kWh</span>
              </div>
              <Progress value={energyProgress} className="h-3" />
            </div>

            {/* Weather */}
            <div className="flex items-center space-x-2">
              <WeatherIcon className={`w-6 h-6 ${currentWeather.color}`} />
              <div>
                <div className="text-sm font-medium capitalize">{gameState.weather}</div>
                <div className="text-xs text-gray-500">
                  {Math.round(currentWeather.multiplier * 100)}% efficiency
                </div>
              </div>
            </div>

            {/* Panels Placed */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gameState.panelsPlaced}</div>
              <div className="text-xs text-gray-500">Panels Placed</div>
            </div>

            {/* Game Controls */}
            <div className="flex space-x-2">
              {!gameState.isPlaying && !gameState.gameCompleted && (
                <Button onClick={startGame} className="flex-1">
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              )}
              
              {gameState.isPlaying && (
                <Button onClick={pauseGame} variant="outline" className="flex-1">
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </Button>
              )}
              
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* Game Grid */}
          <div className="grid grid-cols-8 gap-1 bg-green-100 p-4 rounded-lg max-w-md mx-auto">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const gridX = index % GRID_SIZE;
              const gridY = Math.floor(index / GRID_SIZE);
              const panel = panels.find(p => p.x === gridX && p.y === gridY);
              
              return (
                <div
                  key={index}
                  className={`
                    aspect-square border border-green-300 cursor-pointer transition-all duration-200 rounded
                    ${panel 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-md' 
                      : 'bg-green-50 hover:bg-green-200'
                    }
                  `}
                  onClick={() => {
                    if (panel) {
                      if (selectedPanel?.id === panel.id) {
                        removePanelFromGrid(panel.id);
                        setSelectedPanel(null);
                      } else {
                        setSelectedPanel(panel);
                      }
                    } else {
                      placePanelOnGrid(gridX, gridY);
                    }
                  }}
                  title={panel ? `Solar Panel (${Math.round(panel.efficiency)}% efficiency)` : 'Click to place solar panel'}
                >
                  {panel && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-sm opacity-80"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Game Status */}
          {gameState.gameCompleted && (
            <div className="text-center mt-6 space-y-4">
              {gameState.energy >= gameState.targetEnergy ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Trophy className="w-8 h-8" />
                    <span className="text-2xl font-bold">Level Complete!</span>
                  </div>
                  <p className="text-lg">
                    You generated {Math.floor(gameState.energy)} kWh of clean energy!
                  </p>
                  <Button onClick={nextLevel} className="text-lg px-8 py-3">
                    Next Level
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-orange-600 text-xl font-bold">Time's Up!</div>
                  <p>
                    You generated {Math.floor(gameState.energy)} kWh out of {gameState.targetEnergy} kWh target.
                  </p>
                  <Button onClick={resetGame} className="text-lg px-8 py-3">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 text-sm text-gray-600 text-center space-y-2">
            <p><strong>How to play:</strong> Click on empty green squares to place solar panels</p>
            <p>Generate energy based on weather conditions • Reach the target energy to advance levels</p>
            <p>Click placed panels to remove them • Weather changes every 15 seconds</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSolarGame;
