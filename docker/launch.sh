#!/bin/bash

echo "Verifications..."
if docker kill appsae; then
  echo "Arret de l'image..."
else
  echo "ok"
fi

echo "Verification 1/2"

if docker rm appsae; then
  echo "Suppression de l'image"
else
  echo "ok"
fi

echo "Verification 2/2"

echo "Lancement du build de l'image"
if sudo docker build -t application_solaredge:latest .; then
  echo "Build reussi"
else
  echo "Echec du build."
  exit 1
fi

echo "Demarrage du container"
if sudo docker run -d -p 8080:80 --name appsae application_solaredge:latest; then
  echo ""
  echo ""
  echo ""
  echo "Conteneur demarre avec succes"
  echo "Aller a http://127.0.0.1:8080/ pour acceder au dashboard"
else
  echo ""
  echo ""
  echo ""
  echo "Erreur lors du lancement du conteneur"
  exit 1
fi
