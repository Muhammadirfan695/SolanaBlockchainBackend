#!/bin/bash

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Mise à jour de WhalesX ===${NC}"

# Mise à jour du programme
update_program() {
    echo -e "\n${BLUE}Mise à jour du programme Solana...${NC}"
    
    cd whales-x/program
    
    # Build et déployer les mises à jour
    anchor build
    anchor deploy
    
    echo -e "${GREEN}Programme mis à jour avec succès${NC}"
}

# Mise à jour du frontend
update_frontend() {
    echo -e "\n${BLUE}Mise à jour du frontend...${NC}"
    
    cd ../frontend
    
    # Installer les nouvelles dépendances
    npm install
    
    # Build du frontend
    npm run build
    
    echo -e "${GREEN}Frontend mis à jour avec succès${NC}"
}

# Fonction principale
main() {
    update_program
    update_frontend
    
    echo -e "\n${GREEN}Mise à jour terminée avec succès!${NC}"
    echo -e "\nPour redémarrer le projet:"
    echo -e "1. cd whales-x/frontend"
    echo -e "2. npm run dev"
}

# Exécution du script
main