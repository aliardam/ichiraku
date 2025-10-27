CREATE DATABASE japanese_restaurant;
USE japanese_restaurant;

-- Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    address VARCHAR(255)
);

ALTER TABLE Users
ADD CONSTRAINT chk_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL);

-- Categories
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Menu Items
CREATE TABLE Menu_Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(6,2) NOT NULL,
    image_url VARCHAR(255),
    category_id INT NOT NULL,
    is_drink BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- Ingredients
CREATE TABLE Ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    allergen VARCHAR(50)
);

-- Many-to-many relationship between Menu_Items and Ingredients
CREATE TABLE Item_Ingredients (
    item_id INT,
    ingredient_id INT,
    PRIMARY KEY (item_id, ingredient_id),
    FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)
);

-- Drinks sizes
CREATE TABLE Drink_Sizes (
    drink_id INT,
    size ENUM('Regular', 'Large') NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    PRIMARY KEY (drink_id, size),
    FOREIGN KEY (drink_id) REFERENCES Menu_Items(item_id)
);

-- Orders
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_type ENUM('dine-in', 'delivery') NOT NULL,
    table_number INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Items in an order
CREATE TABLE Order_Items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    item_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id)
);
