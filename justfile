# BW Material Calculator Deployment Commands

# Run predeploy (builds the project)
predeploy:
    npm run predeploy

# Run full deployment (automatically runs predeploy first)
deploy:
    npm run deploy

# List available commands
list:
    @just --list 