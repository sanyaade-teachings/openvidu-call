#!/bin/bash

# Build types library
cd types
npm install
npm run sync-ce
cd ..

# Build backend
cd backend
npm install
cd ..

# Build frontend
cd frontend
npm install
npm run lib:build
cd ..