# 🗺️ NotFar: Find your Rescue

<p align="center">
  <img src="NotFar/src/assets/logo.png" alt="NotFar Logo" width="200"/>
</p>

## 🚀 Descripción

**NotFar** es una plataforma de gestión de rutas de emergencia en tiempo real. Utiliza WebSockets para permitir el rastreo fluido de unidades de rescate, proporcionando cálculos de ruta precisos y estimaciones de tiempo de llegada (ETA) dinámicas para optimizar la respuesta ante emergencias.

Este proyecto integra un **Backend en Node.js** desplegado en Render y un **Frontend en React/TypeScript**.

## ✨ Características Principales

* **Rastreo en Tiempo Real:** Comunicación bidireccional mediante Socket.io para actualizar la posición en el mapa sin recargar la página.
* **Cálculo de Rutas:** Integración con la API de OpenRouteService para generar trayectorias óptimas.
* **Interfaz Interactiva:** Mapas dinámicos implementados con Leaflet y React-Leaflet.
* **Estimación de ETA:** Cálculo en vivo del progreso y tiempo restante basado en la duración real de la ruta.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
* **React 18** con **TypeScript**.
* **Vite** como herramienta de construcción.
* **Leaflet / React-Leaflet** para la renderización de mapas.
* **Socket.io-client** para la conexión en tiempo real.

### Backend
* **Node.js** & **Express**.
* **Socket.io** para la gestión de eventos de red.
* **OpenRouteService API** para datos geoespaciales.

---

## 📂 Estructura del Proyecto

El repositorio está organizado de la siguiente manera:

```text
NotFar-Find-your-Rescue/
└── NotFar/                 # Carpeta principal del proyecto
    ├── src/                # Código fuente del Frontend (React)
    │   ├── assets/         # Imágenes y recursos estáticos
    │   ├── components/     # Componentes modulares del mapa y UI
    │   └── data/           # Lógica de grafos y datos técnicos
    ├── server.js           # Servidor Backend (Socket.io + Express)
    ├── package.json        # Dependencias del proyecto
    └── vite.config.ts      # Configuración de Vite
