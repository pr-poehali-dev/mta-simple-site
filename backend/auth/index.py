import json
import hashlib
import os
import re
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Аутентификация пользователей - регистрация и вход в систему
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с атрибутом request_id
    Returns: HTTP response dict с statusCode, headers, body
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Получаем строку подключения к БД
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                return handle_register(body_data, database_url)
            elif action == 'login':
                return handle_login(body_data, database_url)
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid action'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Server error: {str(e)}'}),
            'isBase64Encoded': False
        }

def validate_email(email: str) -> bool:
    """Валидация email адреса"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_username(username: str) -> bool:
    """Валидация имени пользователя"""
    return len(username) >= 3 and len(username) <= 50 and username.replace('_', '').isalnum()

def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

def handle_register(data: Dict[str, Any], database_url: str) -> Dict[str, Any]:
    """Обработка регистрации нового пользователя"""
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    # Валидация входных данных
    if not username or not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Все поля обязательны для заполнения'}),
            'isBase64Encoded': False
        }
    
    if not validate_username(username):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя пользователя должно содержать 3-50 символов и состоять из букв, цифр и _'}),
            'isBase64Encoded': False
        }
    
    if not validate_email(email):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный формат email адреса'}),
            'isBase64Encoded': False
        }
    
    if len(password) < 6:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пароль должен содержать минимум 6 символов'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        # Подключение к базе данных
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Проверка на существование пользователя
        cursor.execute(
            "SELECT id FROM t_p83778273_mta_simple_site.users WHERE username = %s OR email = %s",
            (username, email)
        )
        existing_user = cursor.fetchone()
        
        if existing_user:
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Пользователь с таким именем или email уже существует'}),
                'isBase64Encoded': False
            }
        
        # Создание нового пользователя
        password_hash = hash_password(password)
        cursor.execute(
            """INSERT INTO t_p83778273_mta_simple_site.users (username, email, password_hash) 
               VALUES (%s, %s, %s) RETURNING id, username, email, created_at""",
            (username, email, password_hash)
        )
        user = cursor.fetchone()
        user_id = user['id']
        
        # Создание игрового профиля
        character_name = f"{username}_Character"
        cursor.execute(
            """INSERT INTO t_p83778273_mta_simple_site.player_profiles (user_id, character_name) 
               VALUES (%s, %s) RETURNING id""",
            (user_id, character_name)
        )
        profile = cursor.fetchone()
        
        # Добавление стартовых достижений
        cursor.execute("SELECT id FROM t_p83778273_mta_simple_site.achievements")
        achievements = cursor.fetchall()
        
        for achievement in achievements:
            cursor.execute(
                "INSERT INTO t_p83778273_mta_simple_site.user_achievements (user_id, achievement_id) VALUES (%s, %s)",
                (user_id, achievement['id'])
            )
        
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': 'Регистрация успешно завершена',
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'created_at': user['created_at'].isoformat()
                }
            }),
            'isBase64Encoded': False
        }
        
    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Database error: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            conn.close()

def handle_login(data: Dict[str, Any], database_url: str) -> Dict[str, Any]:
    """Обработка входа пользователя"""
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Введите имя пользователя и пароль'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        # Подключение к базе данных
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Поиск пользователя
        password_hash = hash_password(password)
        cursor.execute(
            """SELECT u.id, u.username, u.email, u.created_at,
                      p.character_name, p.level, p.experience, p.money,
                      p.playtime_hours, p.jobs_completed, p.races_participated, p.crimes_committed
               FROM t_p83778273_mta_simple_site.users u 
               LEFT JOIN t_p83778273_mta_simple_site.player_profiles p ON u.id = p.user_id
               WHERE u.username = %s AND u.password_hash = %s""",
            (username, password_hash)
        )
        user = cursor.fetchone()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверное имя пользователя или пароль'}),
                'isBase64Encoded': False
            }
        
        # Получение достижений пользователя
        cursor.execute(
            """SELECT a.id, a.name, a.description, a.required_value, a.reward_money,
                      ua.completed, ua.progress, ua.completed_at
               FROM t_p83778273_mta_simple_site.achievements a
               JOIN t_p83778273_mta_simple_site.user_achievements ua ON a.id = ua.achievement_id
               WHERE ua.user_id = %s
               ORDER BY a.id""",
            (user['id'],)
        )
        achievements = cursor.fetchall()
        
        # Формирование ответа
        response_data = {
            'success': True,
            'message': 'Успешный вход в систему',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'created_at': user['created_at'].isoformat() if user['created_at'] else None
            },
            'profile': {
                'character_name': user['character_name'] or f"{user['username']}_Character",
                'level': user['level'] or 1,
                'experience': user['experience'] or 0,
                'money': user['money'] or 0,
                'playtime_hours': user['playtime_hours'] or 0,
                'jobs_completed': user['jobs_completed'] or 0,
                'races_participated': user['races_participated'] or 0,
                'crimes_committed': user['crimes_committed'] or 0
            },
            'achievements': [
                {
                    'id': achievement['id'],
                    'name': achievement['name'],
                    'description': achievement['description'],
                    'required_value': achievement['required_value'],
                    'reward_money': achievement['reward_money'],
                    'completed': achievement['completed'],
                    'progress': achievement['progress'],
                    'completed_at': achievement['completed_at'].isoformat() if achievement['completed_at'] else None
                }
                for achievement in achievements
            ]
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(response_data),
            'isBase64Encoded': False
        }
        
    except psycopg2.Error as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Database error: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            conn.close()