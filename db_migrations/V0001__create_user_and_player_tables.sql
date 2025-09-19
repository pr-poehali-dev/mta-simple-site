-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы игровых персонажей
CREATE TABLE player_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    character_name VARCHAR(50) UNIQUE NOT NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    money BIGINT DEFAULT 0,
    playtime_hours INTEGER DEFAULT 0,
    jobs_completed INTEGER DEFAULT 0,
    races_participated INTEGER DEFAULT 0,
    crimes_committed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы достижений
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    required_value INTEGER DEFAULT 0,
    reward_money INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы прогресса достижений пользователей
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    achievement_id INTEGER REFERENCES achievements(id),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    progress INTEGER DEFAULT 0,
    UNIQUE(user_id, achievement_id)
);

-- Вставка базовых достижений
INSERT INTO achievements (name, description, required_value, reward_money) VALUES
('Первый заработок', 'Заработать первые $1000', 1000, 500),
('Опытный водитель', 'Проехать 1000 км', 1000, 2000),
('Миллионер', 'Накопить $1,000,000', 1000000, 50000),
('Легенда города', 'Достичь 50 уровня', 50, 100000),
('Трудоголик', 'Выполнить 100 заданий', 100, 25000),
('Гонщик', 'Участвовать в 20 гонках', 20, 15000);

-- Индексы для оптимизации
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);