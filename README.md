# 🚀 OutingApp — Application de Sorties & Dates en Temps Réel (Projet DevOps)

Ce projet est un **Monorepo** conçu pour développer et opérer une application mobile d'organisation de sorties en temps réel, avec une architecture pensée pour les bonnes pratiques **DevOps** (Conteneurisation, CI/CD, IaC, Observabilité).

## 📂 Architecture du Monorepo

```text
outing-app/
├── .github/workflows/   # Pipelines CI/CD (GitHub Actions avec filtrage par chemin)
├── backend/             # API REST & WebSockets (Node.js + Express + TypeScript + Socket.io)
├── mobile/              # Application Mobile (Flutter)
├── infra/               # Infrastructure as Code (Docker Compose, Terraform, Kubernetes, Monitoring)
├── .editorconfig        # Standardisation du formatage de code entre tous les développeurs/OS
└── .gitignore           # Fichiers exclus du suivi Git (secrets, dépendances, builds)
```

## 🛠️ Stack Technique

* **Mobile :** Flutter
* **Backend :** Node.js (v22), Express, TypeScript, Socket.io
* **Bases de données :** PostgreSQL + PostGIS (géolocalisation), Redis (Cache & Pub/Sub WebSockets)
* **DevOps :** Docker, Docker Compose, GitHub Actions, Terraform, Kubernetes (K3s), Prometheus & Grafana
