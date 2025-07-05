import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [prediction, setPrediction] = useState(2.47);
  const [confidence, setConfidence] = useState(85);
  const [gameHistory, setGameHistory] = useState([
    {
      id: 1,
      multiplier: 1.23,
      predicted: 2.1,
      result: "win",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      multiplier: 5.67,
      predicted: 3.2,
      result: "loss",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 3,
      multiplier: 2.89,
      predicted: 2.5,
      result: "win",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 4,
      multiplier: 1.05,
      predicted: 1.8,
      result: "loss",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 5,
      multiplier: 8.44,
      predicted: 4.1,
      result: "win",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [botStatus, setBotStatus] = useState("analyzing");
  const [nextGameCountdown, setNextGameCountdown] = useState(15);
  const [roundNumber, setRoundNumber] = useState(1247);
  const [recentPattern, setRecentPattern] = useState([
    1.23, 5.67, 2.89, 1.05, 8.44,
  ]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastAnalysis, setLastAnalysis] = useState(
    new Date().toLocaleTimeString(),
  );

  // Симуляция работы бота и автоматического анализа
  useEffect(() => {
    // Обновление текущего коэффициента
    const multiplierInterval = setInterval(() => {
      setCurrentMultiplier((prev) => {
        const newValue = prev + (Math.random() * 0.1 - 0.05);
        return Math.max(1.0, Math.min(10.0, newValue));
      });
    }, 100);

    // Автоматический анализ каждые 5 секунд
    const analysisInterval = setInterval(() => {
      performAutomaticAnalysis();
    }, 5000);

    // Обратный отсчет до следующей игры
    const countdownInterval = setInterval(() => {
      setNextGameCountdown((prev) => {
        if (prev <= 1) {
          // Новая игра начинается
          setRoundNumber((prev) => prev + 1);
          simulateNewGame();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    // Статус бота
    const botStatusInterval = setInterval(() => {
      const statuses = ["analyzing", "calculating", "monitoring", "predicting"];
      setBotStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 2000);

    return () => {
      clearInterval(multiplierInterval);
      clearInterval(analysisInterval);
      clearInterval(countdownInterval);
      clearInterval(botStatusInterval);
    };
  }, []);

  const performAutomaticAnalysis = () => {
    setIsAnalyzing(true);
    setLastAnalysis(new Date().toLocaleTimeString());

    // Анализ паттернов на основе истории
    const avgRecent =
      recentPattern.slice(-3).reduce((sum, val) => sum + val, 0) / 3;
    const variance =
      recentPattern.reduce(
        (sum, val) => sum + Math.pow(val - avgRecent, 2),
        0,
      ) / recentPattern.length;

    // Расчет предсказания на основе паттернов
    let predictedMultiplier;
    if (variance > 5) {
      // Высокая волатильность - предсказываем низкий коэффициент
      predictedMultiplier = 1.5 + Math.random() * 2;
    } else if (avgRecent > 4) {
      // Недавно были высокие коэффициенты - ожидаем низкий
      predictedMultiplier = 1.2 + Math.random() * 1.5;
    } else {
      // Стандартное предсказание
      predictedMultiplier = 1.8 + Math.random() * 3.5;
    }

    // Расчет уверенности на основе стабильности паттерна
    const confidenceLevel = Math.max(60, Math.min(95, 85 - variance * 2));

    setTimeout(() => {
      setPrediction(predictedMultiplier);
      setConfidence(Math.floor(confidenceLevel));
      setIsAnalyzing(false);
    }, 1500);
  };

  const simulateNewGame = () => {
    // Симуляция нового результата игры
    const newMultiplier =
      Math.random() < 0.3
        ? 1.0 + Math.random() * 1.5 // 30% шанс на низкий коэффициент
        : 1.5 + Math.random() * 6.5; // 70% шанс на нормальный/высокий

    const wasCorrect = Math.abs(newMultiplier - prediction) < 1.5;

    const newGame = {
      id: gameHistory.length + 1,
      multiplier: newMultiplier,
      predicted: prediction,
      result: wasCorrect ? "win" : "loss",
      timestamp: new Date().toLocaleTimeString(),
    };

    setGameHistory((prev) => [newGame, ...prev.slice(0, 9)]);
    setRecentPattern((prev) => [newMultiplier, ...prev.slice(0, 9)]);
    setCurrentMultiplier(newMultiplier);
  };

  const handleManualAnalysis = () => {
    performAutomaticAnalysis();
  };

  const winRate = Math.round(
    (gameHistory.filter((g) => g.result === "win").length /
      gameHistory.length) *
      100,
  );
  const avgMultiplier =
    gameHistory.reduce((sum, g) => sum + g.multiplier, 0) / gameHistory.length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
            GETX Neural Predictor
          </h1>
          <p className="text-muted-foreground">
            Предсказание коэффициентов краш-игры с помощью ИИ
          </p>
        </div>

        {/* Bot Status Alert */}
        <Alert className="border-primary/20 bg-primary/5">
          <Icon name="Bot" className="h-4 w-4 text-primary" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              🤖 Бот активен | Статус:{" "}
              <span className="text-primary font-semibold">{botStatus}</span> |
              Раунд #{roundNumber} | Следующая игра через:{" "}
              <span className="text-primary font-mono">
                {nextGameCountdown}с
              </span>
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"} animate-pulse`}
              />
              <span className="text-xs">
                {isConnected ? "Подключен к GETX" : "Нет соединения"}
              </span>
            </div>
          </AlertDescription>
        </Alert>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Game */}
          <Card className="lg:col-span-2 border-border/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Target" className="text-primary" />
                  Текущая игра
                </div>
                <div className="text-sm text-muted-foreground">
                  Последний анализ: {lastAnalysis}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-primary animate-pulse">
                  {currentMultiplier.toFixed(2)}x
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-green-400 transition-all duration-100"
                    style={{
                      width: `${Math.min(currentMultiplier * 10, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {prediction.toFixed(2)}x
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Предсказание
                  </div>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {confidence}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Уверенность
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleManualAnalysis}
                  disabled={isAnalyzing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isAnalyzing ? (
                    <>
                      <Icon name="Loader2" className="animate-spin mr-2" />
                      Анализ...
                    </>
                  ) : (
                    <>
                      <Icon name="Brain" className="mr-2" />
                      Анализ
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary/10"
                  disabled
                >
                  <Icon name="Bot" className="mr-2" />
                  Авто-режим
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-border/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BarChart3" className="text-primary" />
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Точность</span>
                  <span className="text-primary">{winRate}%</span>
                </div>
                <Progress value={winRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Средний коэфф.</span>
                  <span className="text-green-400">
                    {avgMultiplier.toFixed(2)}x
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Всего игр</span>
                  <span>{gameHistory.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Следующий раунд</span>
                  <span className="text-primary font-mono">
                    {nextGameCountdown}с
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/20 space-y-2">
                <Badge variant="secondary" className="w-full justify-center">
                  <Icon name="Cpu" className="mr-1" size={14} />
                  LSTM Neural Network
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-center text-xs"
                >
                  <Icon name="Activity" className="mr-1" size={12} />
                  Автоанализ каждые 5 сек
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <Card className="border-border/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="History" className="text-primary" />
              История предсказаний
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent">Последние</TabsTrigger>
                <TabsTrigger value="best">Лучшие</TabsTrigger>
                <TabsTrigger value="analysis">Анализ</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                <div className="space-y-2">
                  {gameHistory.slice(0, 8).map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            game.result === "win"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        />
                        <div>
                          <span className="font-mono text-lg">
                            {game.multiplier.toFixed(2)}x
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {game.timestamp}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Предсказано: {game.predicted.toFixed(2)}x
                        </div>
                        <Badge
                          variant={
                            game.result === "win" ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {game.result === "win" ? "Попадание" : "Промах"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="best" className="space-y-4">
                <div className="text-center p-8 text-muted-foreground">
                  <Icon name="Trophy" className="mx-auto mb-2" size={48} />
                  <p>Лучшие предсказания появятся здесь</p>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="TrendingUp" size={16} />
                      Паттерн анализ
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Средний коэффициент (5 игр):</span>
                        <span className="font-mono">
                          {(
                            recentPattern
                              .slice(0, 5)
                              .reduce((sum, val) => sum + val, 0) / 5
                          ).toFixed(2)}
                          x
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Волатильность:</span>
                        <span className="font-mono">
                          {recentPattern.length > 0
                            ? (
                                recentPattern.reduce(
                                  (sum, val) =>
                                    sum +
                                    Math.pow(
                                      val -
                                        recentPattern.reduce(
                                          (s, v) => s + v,
                                          0,
                                        ) /
                                          recentPattern.length,
                                      2,
                                    ),
                                  0,
                                ) / recentPattern.length
                              ).toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Тренд:</span>
                        <span
                          className={`font-mono ${recentPattern[0] > recentPattern[4] ? "text-green-400" : "text-red-400"}`}
                        >
                          {recentPattern[0] > recentPattern[4]
                            ? "↗ Рост"
                            : "↘ Падение"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Target" size={16} />
                      Точность бота
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Точность за сессию:</span>
                        <span className="font-mono text-primary">
                          {winRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Лучший прогноз:</span>
                        <span className="font-mono text-green-400">
                          {Math.max(
                            ...gameHistory.map((g) => g.multiplier),
                          ).toFixed(2)}
                          x
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Статус нейросети:</span>
                        <span className="text-primary">Активна</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
