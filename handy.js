#!/usr/bin/env node

const fs = require('fs');

const filePath = 'items.json';

// Load items from file
let items = {};
try {
    const data = fs.readFileSync(filePath, 'utf8');
    items = JSON.parse(data);
} catch (err) {
    // File doesn't exist or is empty
}

// Add item
function addItem(name, value) {
    let parsedValue;
    // Check if the value is a valid JSON string
    try {
        parsedValue = JSON.parse(value);
    } catch (error) {
        // Treat the value as a regular string
        parsedValue = value;
    }
    items[name] = parsedValue;
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
    console.log(`Added with name '${name}'`);
}



// Remove item
function removeItem(name) {
    if (items[name]) {
        delete items[name];
        fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
        console.log(`Removed item with name '${name}'`);
    } else {
        console.log(`Item with name '${name}' not found`);
    }
}

// Search for item
function searchItem(query) {
    const results = [];
    const regex = new RegExp(query, 'gi');
    for (const name in items) {
        if (name.match(regex) || items[name].match(regex)) {
            results.push({ name, value: items[name] });
        }
    }
    if (results.length === 0) {
        console.log('Not found');
    } else {
        results.forEach(result => {
            console.log(`Name: ${result.name}`);
            console.log('--------------------------------------------');
            console.log(`Value: ${result.value.replace(regex, '\x1b[32m$&\x1b[0m')}`);
        });
    }
}


// Parse command-line arguments
const command = process.argv[2];
const name = process.argv[3];
const value = process.argv[4];

// Perform action based on command
if (command === 'add') {
    if (!name || !value) {
        console.log('Usage: handy add <name> <value>');
    } else {
        addItem(name, value);
    }
} else if (command === 'remove') {
    if (!name) {
        console.log('Usage: handy remove <name>');
    } else {
        removeItem(name);
    }
} else {
    if (!command) {
        console.log('Usage: handy <search_query>');
    } else {
        searchItem(command);
    }
}