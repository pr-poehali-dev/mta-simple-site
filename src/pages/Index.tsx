import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const mockPlayerData = {
  username: "Phoenix_Walker",
  level: 45,
  money: 2450000,
  experience: 75,
  achievements: [
    { id: 1, name: "Первый заработок", description: "Заработать первые $1000", completed: true },
    { id: 2, name: "Опытный водитель", description: "Проехать 1000 км", completed: true },
    { id: 3, name: "Миллионер", description: "Накопить $1,000,000", completed: true },
    { id: 4, name: "Легенда города", description: "Достичь 50 уровня", completed: false },
  ],
  stats: {
    playtime: "156 часов",
    jobs: 234,
    races: 45,
    crimes: 12
  }
};

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username && loginForm.password) {
      setIsLoggedIn(true);
      setActiveTab("profile");
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <header className="border-b border-neon-green/20 bg-dark-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Gamepad2" className="text-neon-green" size={32} />
            <h1 className="text-2xl font-orbitron font-bold text-neon-green">MTA RP SERVER</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-4 py-2 rounded transition-all ${
                activeTab === "home" ? "bg-neon-green text-black" : "text-gray-300 hover:text-neon-green"
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`px-4 py-2 rounded transition-all ${
                activeTab === "register" ? "bg-neon-green text-black" : "text-gray-300 hover:text-neon-green"
              }`}
            >
              Регистрация
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 rounded transition-all ${
                  activeTab === "profile" ? "bg-neon-green text-black" : "text-gray-300 hover:text-neon-green"
                }`}
              >
                Личный кабинет
              </button>
            )}
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2 rounded transition-all ${
                activeTab === "stats" ? "bg-neon-green text-black" : "text-gray-300 hover:text-neon-green"
              }`}
            >
              Статистика
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="text-center py-16 mb-12">
              <h2 className="text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                Добро пожаловать в MTA RP
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Погрузитесь в мир ролевых игр, где каждое решение имеет значение.
                Создайте свою историю в виртуальном мире без границ.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setActiveTab("register")}
                  className="bg-neon-green text-black hover:bg-neon-green/80 px-8 py-3 text-lg font-semibold"
                >
                  <Icon name="UserPlus" className="mr-2" size={20} />
                  Начать играть
                </Button>
                <Button
                  variant="outline"
                  className="border-neon-blue text-neon-blue hover:bg-neon-blue/20 px-8 py-3 text-lg"
                >
                  <Icon name="Play" className="mr-2" size={20} />
                  Смотреть трейлер
                </Button>
              </div>
            </section>

            {/* Features */}
            <section className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-dark-card border-neon-green/20 hover:border-neon-green/40 transition-all">
                <CardHeader>
                  <Icon name="Users" className="text-neon-green mb-2" size={40} />
                  <CardTitle className="text-neon-green">Активное сообщество</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Более 500 активных игроков онлайн каждый день. Найдите друзей и союзников.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-dark-card border-neon-pink/20 hover:border-neon-pink/40 transition-all">
                <CardHeader>
                  <Icon name="Map" className="text-neon-pink mb-2" size={40} />
                  <CardTitle className="text-neon-pink">Огромный мир</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Исследуйте детализированную карту с множеством локаций и секретов.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-dark-card border-neon-blue/20 hover:border-neon-blue/40 transition-all">
                <CardHeader>
                  <Icon name="Trophy" className="text-neon-blue mb-2" size={40} />
                  <CardTitle className="text-neon-blue">Система достижений</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Выполняйте квесты, получайте награды и становитесь легендой сервера.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Login Form */}
            {!isLoggedIn && (
              <Card className="max-w-md mx-auto bg-dark-card border-neon-green/20">
                <CardHeader>
                  <CardTitle className="text-center text-neon-green font-orbitron">Вход в игру</CardTitle>
                  <CardDescription className="text-center text-gray-300">
                    Войдите в свой аккаунт, чтобы продолжить игру
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-gray-300">Имя пользователя</Label>
                      <Input
                        id="username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        className="bg-dark border-gray-600 text-white focus:border-neon-green"
                        placeholder="Введите ваше имя"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-gray-300">Пароль</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="bg-dark border-gray-600 text-white focus:border-neon-green"
                        placeholder="Введите пароль"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-neon-green text-black hover:bg-neon-green/80">
                      <Icon name="LogIn" className="mr-2" size={16} />
                      Войти в игру
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Register Tab */}
        {activeTab === "register" && (
          <div className="animate-fade-in max-w-md mx-auto">
            <Card className="bg-dark-card border-neon-green/20">
              <CardHeader>
                <CardTitle className="text-center text-neon-green font-orbitron">Регистрация</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  Создайте новый аккаунт для игры на сервере
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reg-username" className="text-gray-300">Имя пользователя</Label>
                  <Input
                    id="reg-username"
                    className="bg-dark border-gray-600 text-white focus:border-neon-green"
                    placeholder="Выберите уникальное имя"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email" className="text-gray-300">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    className="bg-dark border-gray-600 text-white focus:border-neon-green"
                    placeholder="Ваш email адрес"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password" className="text-gray-300">Пароль</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    className="bg-dark border-gray-600 text-white focus:border-neon-green"
                    placeholder="Придумайте надежный пароль"
                  />
                </div>
                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/80">
                  <Icon name="UserPlus" className="mr-2" size={16} />
                  Создать аккаунт
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && isLoggedIn && (
          <div className="animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Player Info */}
              <div className="lg:col-span-1">
                <Card className="bg-dark-card border-neon-green/20">
                  <CardHeader>
                    <CardTitle className="text-neon-green font-orbitron">Профиль игрока</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-neon-green/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Icon name="User" className="text-neon-green" size={40} />
                      </div>
                      <h3 className="text-xl font-orbitron text-white">{mockPlayerData.username}</h3>
                      <p className="text-gray-400">Уровень {mockPlayerData.level}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Опыт</span>
                          <span className="text-neon-green">{mockPlayerData.experience}%</span>
                        </div>
                        <Progress value={mockPlayerData.experience} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Деньги:</span>
                        <span className="text-neon-green font-bold">${mockPlayerData.money.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Время в игре:</span>
                        <span className="text-white">{mockPlayerData.stats.playtime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats and Achievements */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-dark-card">
                    <TabsTrigger value="stats" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                      Статистика
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                      Достижения
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stats" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="bg-dark-card border-neon-blue/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-neon-blue flex items-center">
                            <Icon name="Briefcase" className="mr-2" size={16} />
                            Работа
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-white">{mockPlayerData.stats.jobs}</p>
                          <p className="text-gray-400 text-sm">выполнено заданий</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-dark-card border-neon-pink/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-neon-pink flex items-center">
                            <Icon name="Zap" className="mr-2" size={16} />
                            Гонки
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-white">{mockPlayerData.stats.races}</p>
                          <p className="text-gray-400 text-sm">участие в гонках</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-dark-card border-red-500/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-red-400 flex items-center">
                            <Icon name="AlertTriangle" className="mr-2" size={16} />
                            Преступления
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-white">{mockPlayerData.stats.crimes}</p>
                          <p className="text-gray-400 text-sm">нарушений закона</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-dark-card border-neon-green/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-neon-green flex items-center">
                            <Icon name="Clock" className="mr-2" size={16} />
                            Время в игре
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-white">{mockPlayerData.stats.playtime}</p>
                          <p className="text-gray-400 text-sm">общее время</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="mt-6">
                    <div className="space-y-3">
                      {mockPlayerData.achievements.map((achievement) => (
                        <Card
                          key={achievement.id}
                          className={`bg-dark-card border transition-all ${
                            achievement.completed
                              ? "border-neon-green/40 bg-neon-green/5"
                              : "border-gray-600"
                          }`}
                        >
                          <CardContent className="flex items-center space-x-4 p-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              achievement.completed ? "bg-neon-green/20" : "bg-gray-600/20"
                            }`}>
                              <Icon
                                name={achievement.completed ? "Trophy" : "Lock"}
                                className={achievement.completed ? "text-neon-green" : "text-gray-400"}
                                size={24}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-semibold ${achievement.completed ? "text-white" : "text-gray-400"}`}>
                                {achievement.name}
                              </h4>
                              <p className="text-sm text-gray-400">{achievement.description}</p>
                            </div>
                            {achievement.completed && (
                              <Badge className="bg-neon-green text-black">Получено</Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="animate-fade-in">
            <Card className="bg-dark-card border-neon-blue/20">
              <CardHeader>
                <CardTitle className="text-neon-blue font-orbitron">Статистика сервера</CardTitle>
                <CardDescription className="text-gray-300">
                  Общая информация о сервере и активности игроков
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-green mb-2">532</div>
                    <p className="text-gray-300">Игроков онлайн</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-pink mb-2">1,247</div>
                    <p className="text-gray-300">Всего игроков</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-blue mb-2">99.7%</div>
                    <p className="text-gray-300">Время работы</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-green/20 bg-dark-card mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>&copy; 2024 MTA RP Server. Все права защищены.</p>
          <p className="text-sm mt-2">Создано с ❤️ для лучшего игрового опыта</p>
        </div>
      </footer>
    </div>
  );
}