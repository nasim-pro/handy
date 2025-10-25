#!/usr/bin/env bash
set -e

# Handy CLI Installer
# Works on Ubuntu/Linux

echo "🚀 Installing Handy CLI..."

# Determine latest release URL
HANDY_URL="https://github.com/nasim-coder/handy/releases/latest/download/handy-linux"

# Download the binary
echo "Downloading Handy binary..."
curl -L -o handy-temp "$HANDY_URL"

# Make it executable
chmod +x handy-temp

# Move to /usr/local/bin
echo "Installing to /usr/local/bin..."
sudo mv handy-temp /usr/local/bin/handy

# Verify installation
if command -v handy >/dev/null 2>&1; then
    echo "✅ Handy CLI installed successfully!"
    echo "You can now use 'handy' anywhere in the terminal."
    echo "Try: handy list"
else
    echo "❌ Installation failed. Please check permissions or try again."
fi
