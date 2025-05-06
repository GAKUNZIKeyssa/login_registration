CREATE DATABASE IF NOT EXISTS social_media_app;

USE social_media_app;

DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS users;

CREATE TABLE
  users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    items INT NOT NULL,
    category_id INT,
    expiry_date DATE,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INTO NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) GENERATE ALWAYS AS (quantity * unit_price) STORED,
    unit_price DECIMAL(10, 2) NOT NULL,
    sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )

  INSERT INTO users (first_name, last_name, email, password) VALUES
('Alice', 'Johnson', 'alice@example.com', 'password1'),
('Bob', 'Smith', 'bob@example.com', 'password2'),
('Charlie', 'Brown', 'charlie@example.com', 'password3'),
('Diana', 'Evans', 'diana@example.com', 'password4'),
('Ethan', 'Clark', 'ethan@example.com', 'password5'),
('Fiona', 'Taylor', 'fiona@example.com', 'password6'),
('George', 'White', 'george@example.com', 'password7'),
('Hannah', 'Davis', 'hannah@example.com', 'password8');


  INSERT INTO categories (name) VALUES 
  ('Beverages'),
  ('Snacks'),
  ('Dairy'),
  ('Bakery'),
  ('Frozen Foods'),
  ('Fruits'),
  ('Vegetables'),
  ('Household');


  INSERT INTO products (name, price, items, category_id, expiry_date) VALUES
-- Beverages (1)
('Coca Cola 1L', 1.50, 50, 1, '2025-12-31'),
('Pepsi 500ml', 1.00, 80, 1, '2025-10-15'),
('Orange Juice', 2.50, 30, 1, '2025-11-10'),
('Green Tea Bottle', 1.80, 40, 1, '2026-01-01'),

-- Snacks (2)
('Potato Chips', 1.20, 100, 2, '2025-08-01'),
('Chocolate Bar', 0.99, 120, 2, '2025-07-20'),
('Salted Peanuts', 1.10, 90, 2, '2025-09-05'),
('Popcorn Pack', 1.30, 70, 2, '2025-10-10'),

-- Dairy (3)
('Milk 1L', 2.00, 60, 3, '2025-06-15'),
('Yogurt Cup', 0.75, 80, 3, '2025-05-20'),
('Cheddar Cheese', 3.50, 40, 3, '2025-07-01'),
('Butter 500g', 2.80, 30, 3, '2025-06-30'),

-- Bakery (4)
('White Bread', 1.50, 50, 4, '2025-05-08'),
('Whole Wheat Bread', 1.60, 45, 4, '2025-05-10'),
('Croissant', 1.20, 35, 4, '2025-05-07'),
('Bagel', 1.00, 60, 4, '2025-05-09'),

-- Frozen Foods (5)
('Frozen Pizza', 5.50, 20, 5, '2026-03-01'),
('Ice Cream Tub', 4.00, 25, 5, '2026-01-15'),
('Frozen Vegetables Mix', 3.20, 40, 5, '2026-02-20'),
('Chicken Nuggets', 4.75, 30, 5, '2026-04-10'),

-- Fruits (6)
('Apples 1kg', 2.50, 50, 6, '2025-05-10'),
('Bananas 1kg', 1.80, 60, 6, '2025-05-07'),
('Oranges 1kg', 2.20, 55, 6, '2025-05-09'),
('Grapes 500g', 2.00, 45, 6, '2025-05-12'),

-- Vegetables (7)
('Carrots 1kg', 1.60, 70, 7, '2025-05-11'),
('Tomatoes 1kg', 2.10, 65, 7, '2025-05-10'),
('Onions 1kg', 1.50, 80, 7, '2025-05-15'),
('Spinach Bunch', 1.30, 40, 7, '2025-05-08'),

-- Household (8)
('Laundry Detergent', 6.00, 25, 8, NULL),
('Dish Soap', 2.50, 30, 8, NULL),
('Toilet Paper Pack', 4.80, 40, 8, NULL),
('Trash Bags', 3.00, 50, 8, NULL),
('Cleaning Spray', 3.75, 35, 8, NULL),
('Paper Towels', 4.25, 45, 8, NULL),
('Hand Soap', 1.99, 60, 8, NULL);

INSERT INTO sales (user_id, product_id, quantity, unit_price) VALUES
(1, 1, 2, 1.50),
(2, 3, 1, 2.50),
(3, 6, 3, 0.99),
(4, 9, 1, 2.00),
(5, 10, 2, 0.75),
(6, 12, 1, 2.80),
(7, 14, 4, 1.60),
(8, 16, 2, 1.00),

(1, 18, 1, 4.00),
(2, 20, 2, 4.75),
(3, 22, 3, 1.80),
(4, 25, 2, 2.10),
(5, 27, 1, 1.30),
(6, 30, 2, 6.00),
(7, 32, 1, 4.80),
(8, 33, 3, 3.00),

(1, 2, 2, 1.00),
(2, 5, 1, 1.20),
(3, 11, 2, 3.50),
(4, 13, 1, 1.50),
(5, 19, 3, 3.20),
(6, 23, 2, 2.20),
(7, 26, 1, 1.50),
(8, 35, 2, 1.99);
