# Administrator web app for manage bookings
This web application is designed for administrators to efficiently manage bookings and related tasks for properties. It offers a comprehensive set of features including the ability to add and edit bookings, manage exchange items such as income and expenses, and provide investors with a dashboard and analytics. Additionally, it supports transactions between investors and allows for detailed property settings management.

The app is built using modern technologies such as Vue 3, TypeScript, and the Quasar framework, ensuring a robust and scalable solution. It integrates with Firebase for real-time database capabilities and supports authentication, localization, and PWA implementation. The development environment is streamlined with tools like Vite, Vitest, and Pinia for state management, and the application is containerized using Docker for easy deployment and management.

## Features:
    ✔ Add/Edit booking
    ✔ Add/Edit Echange items (income, expenses, bills etc)
    ✔ Investor dashboard and analytics
    ✔ Transactions between investors
    ✔ Add/Edit property settings

## Tech stack & SPA setup:
    ✔ Authentication
    ✔ Integration with Firebase and use of Realtime database
    ✔ Localization
    ✔ Typescript
    ✔ Vue 3
    ✔ Vite
    ✔ Vitest
    ✔ Pinia store management
    ✔ Quasar framework for component library
    ✔ Tailwind use for styles
    ✔ PWA implementation
    ✔ Dockerization

### Docker setup

#### Build Image

```
docker build -t bnb .
```

#### Run Container

```
docker run --rm -it -v $(pwd):/app -p 8080:8080 --name ADMIN_BNB bnb
```

#### Open Terminal

```
docker exec -it ADMIN_BNB /bin/sh -c "[ -e /bin/bash ] && /bin/sh"
```
