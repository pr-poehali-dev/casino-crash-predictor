import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [prediction, setPrediction] = useState(2.47);
  const [confidence, setConfidence] = useState(85);
  const [gameHistory, setGameHistory] = useState([
    { id: 1, multiplier: 1.23, predicted: 2.1, result: "win" },
    { id: 2, multiplier: 5.67, predicted: 3.2, result: "loss" },
    { id: 3, multiplier: 2.89, predicted: 2.5, result: "win" },
    { id: 4, multiplier: 1.05, predicted: 1.8, result: "loss" },
    { id: 5, multiplier: 8.44, predicted: 4.1, result: "win" },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMultiplier((prev) => {
        const newValue = prev + (Math.random() * 0.1 - 0.05);
        return Math.max(1.0, Math.min(10.0, newValue));
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPrediction(Math.random() * 8 + 1);
      setConfidence(Math.floor(Math.random() * 30 + 70));
      setIsAnalyzing(false);
    }, 2000);
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

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Game */}
          <Card className="lg:col-span-2 border-border/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Target" className="text-primary" />
                Текущая игра
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

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isAnalyzing ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" />
                    Анализирую...
                  </>
                ) : (
                  <>
                    <Icon name="Brain" className="mr-2" />
                    Проанализировать
                  </>
                )}
              </Button>
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

              <div className="pt-4 border-t border-border/20">
                <Badge variant="secondary" className="w-full justify-center">
                  <Icon name="Cpu" className="mr-1" size={14} />
                  LSTM Neural Network
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
                  {gameHistory.slice(0, 5).map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            game.result === "win"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        />
                        <span className="font-mono text-lg">
                          {game.multiplier.toFixed(2)}x
                        </span>
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
                <div className="text-center p-8 text-muted-foreground">
                  <Icon name="LineChart" className="mx-auto mb-2" size={48} />
                  <p>Детальный анализ в разработке</p>
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
