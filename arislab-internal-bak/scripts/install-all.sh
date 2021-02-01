
#!/bin/sh

# Install all dependencies first
echo "⏳ Installing package dependencies..."
npm install

echo "⏳ Installing service dependencies..."
npm run-script install-all

# Then build all
echo "🍳 Building ..."
npm run-script build-all