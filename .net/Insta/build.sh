#!/bin/bash

echo "Building Instagram Publisher Solution..."
echo ""

# Build the class library
echo "Building InstagramPublisher class library..."
dotnet build InstagramPublisher/InstagramPublisher.csproj --configuration Release

if [ $? -eq 0 ]; then
    echo "✓ Class library built successfully!"
    echo "  Output: InstagramPublisher/bin/Release/net6.0/InstagramPublisher.dll"
else
    echo "✗ Failed to build class library"
    exit 1
fi

echo ""

# Build the console test app
echo "Building console test application..."
dotnet build InstagramPublisher.ConsoleTest/InstagramPublisher.ConsoleTest.csproj --configuration Release

if [ $? -eq 0 ]; then
    echo "✓ Console app built successfully!"
    echo "  Output: InstagramPublisher.ConsoleTest/bin/Release/net6.0/InstagramPublisher.ConsoleTest.dll"
else
    echo "✗ Failed to build console app"
    exit 1
fi

echo ""
echo "=== Build Complete ==="
echo ""
echo "To use in your project, reference:"
echo "  InstagramPublisher/bin/Release/net6.0/InstagramPublisher.dll"
echo ""
echo "To run console test:"
echo "  dotnet run --project InstagramPublisher.ConsoleTest"
echo ""
