#!/bin/bash

# SeekSphere SDK Release Script
set -e

echo "🚀 Starting SeekSphere SDK release process..."

# Check if we're on main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Error: You must be on the main branch to release"
  exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Error: Working directory is not clean. Please commit or stash changes."
  exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm run test:coverage

# Build project
echo "🔨 Building project..."
npm run build

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Current version: $CURRENT_VERSION"

# Ask for version bump type
echo "🔢 What type of version bump?"
echo "1) patch (bug fixes)"
echo "2) minor (new features)"
echo "3) major (breaking changes)"
read -p "Enter choice (1-3): " VERSION_CHOICE

case $VERSION_CHOICE in
  1) VERSION_TYPE="patch";;
  2) VERSION_TYPE="minor";;
  3) VERSION_TYPE="major";;
  *) echo "❌ Invalid choice"; exit 1;;
esac

# Bump version
echo "⬆️ Bumping $VERSION_TYPE version..."
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ New version: $NEW_VERSION"

# Update CHANGELOG
echo "📝 Please update CHANGELOG.md with the new version and changes"
echo "Press any key when ready to continue..."
read -n 1

# Commit changes
echo "💾 Committing version bump..."
git add package.json CHANGELOG.md
git commit -m "chore: bump version to $NEW_VERSION"

# Create and push tag
echo "🏷️ Creating and pushing tag..."
git tag "v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"

echo "🎉 Release process completed!"
echo "📦 Version $NEW_VERSION has been tagged and pushed"
echo "🤖 GitHub Actions will now handle the npm publish and GitHub release"