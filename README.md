# Axylum Starter

> A production-ready full-stack starter template built with React, TypeScript, Express, PostgreSQL, Prisma, and JWT Authentication.

## Overview

Axylum Starter is a reusable full-stack application template designed to eliminate repetitive setup work when starting new projects.

Instead of rebuilding authentication, project structure, and backend architecture for every application, this starter provides a secure, scalable foundation that can be extended into virtually any business application.

Examples include:

* Sales & Inventory Management
* Customer Relationship Management (CRM)
* Hospital Management System
* Learning Management System (LMS)
* HR Management System
* Asset Management
* Cybersecurity Dashboard
* E-commerce Platform

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* React Router DOM
* Axios

## Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL

## Authentication

* JWT Authentication
* Password Hashing (bcrypt)
* Protected Routes
* Authentication Middleware

## Validation

* Zod

---

# Project Structure

```text
auth-system/

├── client/
│
│   ├── src/
│   │
│   ├── api/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── routes/
│   ├── types/
│   ├── hooks/
│   ├── components/
│   └── App.tsx
│
└── server/
    │
    ├── prisma/
    ├── src/
    │
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── routes/
    ├── services/
    ├── schemas/
    ├── lib/
    ├── utils/
    └── server.ts

    