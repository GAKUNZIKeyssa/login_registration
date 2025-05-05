CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  items INT NOT NULL,
  category_id INT,
  expiry_date DATE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
