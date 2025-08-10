
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { 
  Sun, 
  Zap, 
  Target, 
  Trophy, 
  CloudRain, 
  Cloud, 
  CloudSnow,
  Moon,
  Timer,
  Coins,
  Award,
  RotateCcw,
  Info
} from 'lucide-react';

interface Panel {
  id: number;
  x: number;
  y: number;
  angle: number;
  efficiency: number;
  isActive: boolean;
  energyGenerated: number;
}

interface WeatherConditions {
  type: 'sunny' | 'cloudy' | 'rainy' | 'night';
  multiplier: number;
  icon: React.ComponentType<any>;
  description: string;
}

const weatherTypes: WeatherConditions[] = [
  { type: 'sunny', multiplier: 1.0, icon: Sun, description: 'Perfect conditions!' },
  { type: 'cloudy', multiplier: 0.6, icon: Cloud, description: 'Reduced sunlight' },
  { type: 'rainy', multiplier: 0.3, icon: CloudRain, description: 'Very low generation' },
  { type: 'night', multiplier: 0.0, icon: Moon, description: 'No solar generation' }
];

const EnhancedSolarGame = () => {
  const { user } = useSupabaseAuth();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [weather, setWeather] = useState<WeatherConditions>(weatherTypes[0]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [gameActive, setGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(100);
  const [objectives, setObjectives] = useState({
    energyTarget: 1000,
    panelTarget: 10,
    efficiencyTarget: 80
  });
  const [gameStats, setGameStats] = useState({
    energyGenerated: 0,
    panelsPlaced: 0,
    averageEfficiency: 0,
    weatherChanges: 0
  });

  const startGame = () => {
    setGameActive(true);
    setGameCompleted(false);
    setScore(0);
    setEnergy(0);
    setPanels([]);
    setTimeLeft(120);
    setCoins(100);
    setLevel(1);
    setGameStats({
      energyGenerated: 0,
      panelsPlaced: 0,
      averageEfficiency: 0,
      weatherChanges: 0
    });
    setWeather(weatherTypes[0]);
  };

  const endGame = useCallback(async () => {
    setGameActive(false);
    setGameCompleted(true);

    // Save score if user is logged in
    if (user) {
      try {
        await supabase.from('game_scores').insert({
          user_id: user.id,
          score,
          energy_generated: energy,
          panels_placed: panels.length,
          game_duration: 120 - timeLeft
        });
      } catch (error) {
        console.error('Error saving game score:', error);
      }
    }
  }, [user, score, energy, panels.length, timeLeft]);

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameActive, timeLeft, endGame]);

  // Weather changes
  useEffect(() => {
    if (!gameActive) return;

    const weatherInterval = setInterval(() => {
      const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      setWeather(randomWeather);
      setGameStats(prev => ({ ...prev, weatherChanges: prev.weatherChanges + 1 }));
    }, 15000); // Change weather every 15 seconds

    return () => clearInterval(weatherInterval);
  }, [gameActive]);

  // Energy generation
  useEffect(() => {
    if (!gameActive || panels.length === 0) return;

    const energyInterval = setInterval(() => {
      let totalEnergyGenerated = 0;
      
      setPanels(prevPanels => 
        prevPanels.map(panel => {
          const baseGeneration = panel.efficiency * 0.5;
          const weatherAdjusted = baseGeneration * weather.multiplier;
          const energyThisTick = weatherAdjusted;
          
          totalEnergyGenerated += energyThisTick;
          
          return {
            ...panel,
            energyGenerated: panel.energyGenerated + energyThisTick
          };
        })
      );

      setEnergy(prev => prev + totalEnergyGenerated);
      setScore(prev => prev + Math.floor(totalEnergyGenerated * 10));
      setGameStats(prev => ({ 
        ...prev, 
        energyGenerated: prev.energyGenerated + totalEnergyGenerated 
      }));
    }, 1000);

    return () => clearInterval(energyInterval);
  }, [gameActive, panels.length, weather.multiplier]);

  const placeSolarPanel = (x: number, y: number) => {
    if (!gameActive || coins < 20) return;

    const angle = Math.random() * 360;
    const efficiency = Math.floor(Math.random() * 40) + 60; // 60-100% efficiency

    const newPanel: Panel = {
      id: Date.now(),
      x,
      y,
      angle,
      efficiency,
      isActive: true,
      energyGenerated: 0
    };

    setPanels(prev => [...prev, newPanel]);
    setCoins(prev => prev - 20);
    setGameStats(prev => ({ 
      ...prev, 
      panelsPlaced: prev.panelsPlaced + 1,
      averageEfficiency: prev.panelsPlaced === 0 ? efficiency : 
        ((prev.averageEfficiency * prev.panelsPlaced) + efficiency) / (prev.panelsPlaced + 1)
    }));

    // Level up logic
    if (panels.length + 1 >= level * 5) {
      setLevel(prev => prev + 1);
      setCoins(prev => prev + 50);
    }
  };

  const getWeatherIcon = () => {
    const IconComponent = weather.icon;
    return <IconComponent className="w-6 h-6" />;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (!gameActive && !gameCompleted) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <Sun className="w-8 h-8 text-yellow-500" />
            <span>Solar Panel Challenge</span>
            <Zap className="w-8 h-8 text-blue-500" />
          </CardTitle>
          <CardDescription className="text-lg">
            Master solar energy generation in this educational game!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <Target className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold text-yellow-800">Objectives</h3>
              <p className="text-sm text-yellow-700">
                Generate 1000 kWh, place 10 panels, maintain efficiency
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <CloudRain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">Weather System</h3>
              <p className="text-sm text-blue-700">
                Adapt to changing weather conditions affecting generation
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Learn & Earn</h3>
              <p className="text-sm text-green-700">
                Discover solar energy principles while having fun
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              How to Play
            </h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Click on the solar field to place panels (costs 20 coins)</li>
              <li>• Each panel generates energy based on efficiency and weather</li>
              <li>• Weather changes every 15 seconds affecting generation</li>
              <li>• Complete objectives within 2 minutes to win!</li>
              <li>• Level up by placing more panels to earn bonus coins</li>
            </ul>
          </div>

          <div className="text-center">
            <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <Sun className="w-5 h-5 mr-2" />
              Start Solar Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    const energyObjectiveComplete = energy >= objectives.energyTarget;
    const panelObjectiveComplete = panels.length >= objectives.panelTarget;
    const efficiencyObjectiveComplete = gameStats.averageEfficiency >= objectives.efficiencyTarget;
    const allObjectivesComplete = energyObjectiveComplete && panelObjectiveComplete && efficiencyObjectiveComplete;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <Trophy className={`w-8 h-8 ${allObjectivesComplete ? 'text-yellow-500' : 'text-gray-400'}`} />
            <span>{allObjectivesComplete ? 'Congratulations!' : 'Game Complete'}</span>
          </CardTitle>
          <CardDescription>
            {allObjectivesComplete 
              ? 'You successfully completed all objectives!' 
              : 'Good effort! Try again to complete all objectives.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-800">{Math.floor(energy)}</div>
              <div className="text-sm text-blue-600">kWh Generated</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-800">{panels.length}</div>
              <div className="text-sm text-green-600">Panels Placed</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-800">{Math.floor(gameStats.averageEfficiency)}%</div>
              <div className="text-sm text-purple-600">Avg Efficiency</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <Coins className="w-6 h-6 text-orange-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-orange-800">{score}</div>
              <div className="text-sm text-orange-600">Final Score</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Objectives</h3>
            <div className="space-y-2">
              <div className={`flex items-center justify-between p-2 rounded ${energyObjectiveComplete ? 'bg-green-50' : 'bg-red-50'}`}>
                <span>Generate {objectives.energyTarget} kWh</span>
                <Badge variant={energyObjectiveComplete ? 'default' : 'destructive'}>
                  {energyObjectiveComplete ? 'Complete' : 'Failed'}
                </Badge>
              </div>
              <div className={`flex items-center justify-between p-2 rounded ${panelObjectiveComplete ? 'bg-green-50' : 'bg-red-50'}`}>
                <span>Place {objectives.panelTarget} panels</span>
                <Badge variant={panelObjectiveComplete ? 'default' : 'destructive'}>
                  {panelObjectiveComplete ? 'Complete' : 'Failed'}
                </Badge>
              </div>
              <div className={`flex items-center justify-between p-2 rounded ${efficiencyObjectiveComplete ? 'bg-green-50' : 'bg-red-50'}`}>
                <span>Maintain {objectives.efficiencyTarget}% efficiency</span>
                <Badge variant={efficiencyObjectiveComplete ? 'default' : 'destructive'}>
                  {efficiencyObjectiveComplete ? 'Complete' : 'Failed'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={startGame} className="bg-gradient-to-r from-green-500 to-blue-500">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Game Header */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-lg font-bold">{formatTime(timeLeft)}</div>
              <div className="text-xs text-gray-500">Time Left</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <div>
              <div className="text-lg font-bold">{Math.floor(energy)}</div>
              <div className="text-xs text-gray-500">kWh</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-lg font-bold">{score}</div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-orange-600" />
            <div>
              <div className="text-lg font-bold">{coins}</div>
              <div className="text-xs text-gray-500">Coins</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center space-x-2">
            {getWeatherIcon()}
            <div>
              <div className="text-sm font-medium capitalize">{weather.type}</div>
              <div className="text-xs text-gray-500">{Math.floor(weather.multiplier * 100)}%</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-purple-600" />
            <div>
              <div className="text-lg font-bold">{level}</div>
              <div className="text-xs text-gray-500">Level</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Solar Field */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Solar Field</span>
              <span className="text-sm font-normal text-gray-500">
                Click to place panels (20 coins each)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="relative w-full h-96 bg-gradient-to-b from-sky-200 to-green-200 rounded-lg border-2 border-dashed border-gray-300 cursor-crosshair overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                placeSolarPanel(x, y);
              }}
            >
              {panels.map(panel => (
                <div
                  key={panel.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{ 
                    left: `${panel.x}%`, 
                    top: `${panel.y}%`,
                    transform: `translate(-50%, -50%) rotate(${panel.angle}deg)`
                  }}
                >
                  <div className="w-8 h-6 bg-gradient-to-r from-blue-800 to-blue-900 rounded shadow-lg relative group">
                    <div className="absolute inset-0 bg-white bg-opacity-20 rounded grid grid-cols-2 gap-px p-px">
                      <div className="bg-blue-700 rounded-sm"></div>
                      <div className="bg-blue-700 rounded-sm"></div>
                      <div className="bg-blue-700 rounded-sm"></div>
                      <div className="bg-blue-700 rounded-sm"></div>
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {panel.efficiency}% • {Math.floor(panel.energyGenerated)} kWh
                    </div>
                  </div>
                </div>
              ))}
              
              {panels.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Sun className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Click anywhere to place your first solar panel!</p>
                    <p className="text-sm">Cost: 20 coins</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Objectives Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Objectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Energy Target</span>
                <span>{Math.floor(energy)}/{objectives.energyTarget} kWh</span>
              </div>
              <Progress value={getProgressPercentage(energy, objectives.energyTarget)} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Panels Target</span>
                <span>{panels.length}/{objectives.panelTarget}</span>
              </div>
              <Progress value={getProgressPercentage(panels.length, objectives.panelTarget)} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Efficiency</span>
                <span>{Math.floor(gameStats.averageEfficiency)}%/{objectives.efficiencyTarget}%</span>
              </div>
              <Progress value={getProgressPercentage(gameStats.averageEfficiency, objectives.efficiencyTarget)} className="h-2" />
            </div>

            <div className="pt-4 border-t space-y-2">
              <h4 className="font-medium text-sm">Weather Effects</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Sun className="w-3 h-3 text-yellow-500" />
                    <span>Sunny</span>
                  </div>
                  <span className="text-green-600">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Cloud className="w-3 h-3 text-gray-500" />
                    <span>Cloudy</span>
                  </div>
                  <span className="text-yellow-600">60%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <CloudRain className="w-3 h-3 text-blue-500" />
                    <span>Rainy</span>
                  </div>
                  <span className="text-orange-600">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Moon className="w-3 h-3 text-indigo-500" />
                    <span>Night</span>
                  </div>
                  <span className="text-red-600">0%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSolarGame;
