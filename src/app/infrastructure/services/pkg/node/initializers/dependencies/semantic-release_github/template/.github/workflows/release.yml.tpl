name: Release

on: 
  push:
    branches:
      - 'main'

jobs:
  release:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm install

      - name: Run semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release
