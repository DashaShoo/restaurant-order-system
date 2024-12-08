from flask import Flask, request, jsonify
from flask_cors import CORS  # Импортируем CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)  # Включаем CORS для всех доменов

# Конфигурация базы данных из переменных окружения
db_config = {
    "host": os.getenv("DB_HOST", "db"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "rootpassword"),
    "database": os.getenv("DB_NAME", "restaurant"),
}

@app.route("/")
def home():
    return "Добро пожаловать в API ресторана!"

@app.route("/api/order", methods=["POST"])
def order():
    data = request.get_json()
    print("Received data:", data)  # Отладочное сообщение

    name = data.get("name")
    address = data.get("address")
    phone = data.get("phone")
    
    items = data.get("items")  # Содержимое корзины
    
    if not all([name, address, phone]):
        return jsonify({"error": "Все поля обязательны для заполнения"}), 400
    
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        cursor.execute("INSERT INTO orders (name, address, phone) VALUES (%s, %s, %s)", 
                       (name, address, phone))
        
        order_id = cursor.lastrowid
        
        for item in items:
            cursor.execute("INSERT INTO order_items (order_id, dish_name, price, quantity) VALUES (%s, %s, %s, %s)",
                           (order_id, item['name'], item['price'], item['quantity']))
        
        conn.commit()
        
        return jsonify({"message": "Заказ успешно оформлен!"}), 201
    
    except Exception as e:
        print("Error occurred:", str(e))  # Отладочное сообщение
        return jsonify({"error": str(e)}), 500
    
    finally:
        if cursor is not None:
            cursor.close()
        if conn is not None:
            conn.close()

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)