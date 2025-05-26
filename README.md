# Demining Assistant

This project is designed to assist **humanitarian demining specialists** in identifying explosive objects. It provides a unified platform accessible via web and mobile applications, offering structured data, visual references, and shared intelligence for safe and effective fieldwork.

## 🔧 Architecture

This is a **monorepo** managed with **Yarn Workspaces** and **Lerna**, structured as follows:

### 📦 Projects (inside `apps/`)
- **`web`** – A React-based web application for documentation and management.
- **`ammo`** – A React Native mobile application for field specialists to identify explosive objects.
- **`functions`** – Firebase Cloud Functions acting as backend services (e.g. clustering, data preprocessing).

### 🧩 Shared Packages (inside `packages/`)
- **`shared`** – Contains common code (e.g. database types, utilities) used across all platforms.
- **`shared-client`** – Contains reusable logic specifically for client applications (`web` and `ammo`).

### ☁️ Backend
- **Firestore** – Realtime database for storing structured data.
- **Cloud Functions** – Serverless backend for logic like map clustering and data processing.

---

## ✅ Built With
- React & React Native
- Firebase Firestore
- Firebase Cloud Functions
- Yarn Workspaces + Lerna (monorepo)