#\/usr/bin/bash

BLUE='\033[0;34m'
BBLUE='\033[1;34m'
BGREEN='\033[1;32m'
BYELLOW='\033[1;33m'
BRED='\033[1;31m'
NC='\033[0m'

printf "${BLUE}
.d8888. d888888b .88b  d88. d8888b. db      d88888b     d8b   db d88888b d888888b 
88'  YP   \`88'   88'YbdP\`88 88  \`8D 88      88'         888o  88 88'     \`~~88~~' 
\`8bo.      88    88  88  88 88oodD' 88      88ooooo     88V8o 88 88ooo      88    
\`Y8b.      88    88  88  88 88~~~   88      88~~~~      88 V8o88 88~~~      88    
db   8D   .88.   88  88  88 88      88booo. 88.         88  V888 88         88    
\`8888Y' Y888888P YP  YP  YP 88      Y88888P Y88888P     VP   V8P YP         YP   
${BBLUE}Let's make sure git is installed 📦
${NC}"

# Verify if git is installed
if ! [ -x "$(command -v git)" ]; then
  printf "${BRED}Git is not installed. Please install it before running this script.
${NC}"
  exit 1
fi

printf "${BGREEN}Let's make sure the branch is up to date 🔄
${NC}"

# Make sure the branch is up to date
git pull

printf "${BYELLOW}Let's verify if NPM is installed 📦
${NC}"

# Verify if NPM is installed
if ! [ -x "$(command -v npm)" ]; then
  printf "${BRED}NPM is not installed. Please install it before running this script.
${NC}"
  exit 1
fi

printf "${BGREEN}Let's install the dependencies 📦
${NC}"

# Install the dependencies
npm install

printf "${BBLUE}Let's make sure the dependencies are up to date 📦
${NC}"

# Make sure the dependencies are up to date
npm outdated

printf "${BYELLOW}Let's make sure we build the latest version of the contracts ABI 📦
${NC}"

npm run build

printf "${BYELLOW}Let's make sure the contracts are compiled 📦
${NC}"

# Make sure the contracts are compiled
npx hardhat compile

printf "${BYELLOW}Let's run the tests 🧪
${NC}"

# Run hardhat test
npm run test

printf "${BBLUE}Let's run foundry tests 🧪
${NC}"

# Run foundry test
forge test

printf "${BGREEN}Let's run the linter for tests 🧹
${NC}"

# Run linter for tests
npm run prettier-test

printf "${BYELLOW}Let's run the linter for scripts 🧹
${NC}"

# Run linter for scripts
npm run prettier-scripts

printf "${BBLUE}Let's run the linter for contracts 🧹
${NC}"

# Run linter for contracts
npm run prettier-contracts

printf "${BGREEN}Let's run the linter for foundry tests 🧹
${NC}"

# Run linter for foundry tests
npm run prettier-foundry-contracts

printf "${BBLE}Let's publish the package 📦
${NC}"

# Publish the package
npm publish