#!/usr/bin/env -S deno run --allow-read --allow-write

// Simple JSON-based key-value CLI utility
// Commands: add <key> <value>, remove <key>, get <key>, list, search <pattern>

const DB_FILE = `${Deno.env.get("HOME")}/.handy.json`;

interface HandyData {
  [key: string]: string;
}

// Read or create DB
function loadDB(): HandyData {
  try {
    const text = Deno.readTextFileSync(DB_FILE);
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function saveDB(data: HandyData) {
  Deno.writeTextFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function help() {
  console.log(`
Handy CLI - Simple JSON key-value manager

Usage:
  handy add <key> <value>       Add a key-value pair
  handy remove <key>            Remove a key
  handy get <key>               Get a value
  handy list                    List all items
  handy search <pattern>        Search keys or values by regex pattern
  handy help                    Show this message
`);
}

const args = Deno.args;

if (args.length === 0) {
  help();
  Deno.exit(0);
}

const cmd = args[0];
const db = loadDB();

switch (cmd) {
  case "add": {
    const [key, value] = args.slice(1);
    if (!key || !value) {
      console.error("Usage: handy add <key> <value>");
      Deno.exit(1);
    }
    db[key] = value;
    saveDB(db);
    console.log(`Added: ${key} = ${value}`);
    break;
  }

  case "remove": {
    const key = args[1];
    if (!key) {
      console.error("Usage: handy remove <key>");
      Deno.exit(1);
    }
    if (db[key]) {
      delete db[key];
      saveDB(db);
      console.log(`Removed: ${key}`);
    } else {
      console.log("Key not found");
    }
    break;
  }

  case "get": {
    const key = args[1];
    if (!key) {
      console.error("Usage: handy get <key>");
      Deno.exit(1);
    }
    console.log(db[key] ?? "Not found");
    break;
  }

  case "list": {
    const keys = Object.keys(db);
    if (keys.length === 0) {
      console.log("No data found");
    } else {
      keys.forEach((k) => console.log(`${k}: ${db[k]}`));
    }
    break;
  }

  case "search": {
    const pattern = args[1];
    if (!pattern) {
      console.error("Usage: handy search <pattern>");
      Deno.exit(1);
    }
    const regex = new RegExp(pattern, "i");
    const results = Object.entries(db).filter(
      ([k, v]) => regex.test(k) || regex.test(v),
    );
    if (results.length === 0) {
      console.log("No matches found");
    } else {
      results.forEach(([k, v]) => console.log(`${k}: ${v}`));
    }
    break;
  }

  case "help":
  default:
    help();
    break;
}
