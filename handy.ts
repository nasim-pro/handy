#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

const DB_FILE = `${Deno.env.get("HOME")}/.handy.json`;

interface HandyData {
  [key: string]: string;
}

// Read DB or create if missing
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
  h add <key> <value>       Add a key-value pair
  h remove <key>            Remove a key
  h get <key>               Get a value
  h list                    List all items
  h search <pattern>        Search keys or values by regex pattern
  h help                    Show this message
`);
}

// Ask user for yes/no input
async function askYesNo(question: string): Promise<boolean> {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(question + " (y/n): "));
  const n = <number>await Deno.stdin.read(buf);
  if (!n) return false;
  const input = new TextDecoder().decode(buf.subarray(0, n)).trim().toLowerCase();
  return input === "y" || input === "yes";
}

const args = Deno.args;

if (args.length === 0) {
  help();
  Deno.exit(0);
}

const cmd = args[0].toLowerCase();
const db = loadDB();

switch (cmd) {
  case "add": {
    const key = args[1];
    if (!key || args.length < 3) {
      console.error("Usage: h add <key> <value>");
      Deno.exit(1);
    }
    const value = args.slice(2).join(" ");

    if (db[key]) {
      const overwrite = await askYesNo(`Key "${key}" already exists. Overwrite?`);
      if (!overwrite) {
        console.log("Aborted.");
        Deno.exit(0);
      }
    }

    db[key] = value;
    saveDB(db);
    console.log(`✅ Added: ${key} = ${value}`);
    break;
  }

  case "remove": {
    const key = args[1];
    if (!key) {
      console.error("Usage: h remove <key>");
      Deno.exit(1);
    }
    if (db[key]) {
      delete db[key];
      saveDB(db);
      console.log(`✅ Removed: ${key}`);
    } else {
      console.log("Key not found");
    }
    break;
  }

  case "get": {
    const key = args[1];
    if (!key) {
      console.error("Usage: h get <key>");
      Deno.exit(1);
    }
    console.log(db[key] ?? "Not found");
    break;
  }

  case "list": {
    const keys = Object.keys(db);
    if (!keys.length) {
      console.log("No data found");
    } else {
      keys.forEach((k) => console.log(`${k}: ${db[k]}`));
    }
    break;
  }

  case "search": {
    if (args.length < 2) {
      console.error("Usage: h search <pattern>");
      Deno.exit(1);
    }
    const pattern = args.slice(1).join(" ");
    const regex = new RegExp(pattern, "i");
    const results = Object.entries(db).filter(
      ([k, v]) => regex.test(k) || regex.test(v),
    );

    if (!results.length) {
      console.log("No matches found");
    } else {
      results.forEach(([k, v]) => {
        const highlightedKey = k.replace(regex, "\x1b[32m$&\x1b[0m");
        const highlightedValue = v.replace(regex, "\x1b[32m$&\x1b[0m");
        console.log(`${highlightedKey}: ${highlightedValue}`);
      });
    }
    break;
  }

  case "help":
  default:
    help();
    break;
}
