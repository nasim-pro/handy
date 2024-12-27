# Handy Utility App

`handy` is a simple command-line utility for managing items stored in a JSON file. You can add, remove, and search for items with ease in a terminal.

---

## Features

- **Add Items**: Add key-value pairs to the storage.
- **Remove Items**: Delete an item by its name.
- **Search Items**: Search for items by name or value using regex-like patterns.

---

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/nasim-coder/handy.git
    cd handy
    ```

2. Make the script executable:
    ```bash
    chmod +x handy.js
    ```

3. Optionally, add it to your PATH for easy access:
    ```bash
    sudo ln -s $(pwd)/handy.js /usr/local/bin/handy
    ```

---

## Usage

### Add an Item
Add a key-value pair to the storage:
```bash
handy add <name> <value>
