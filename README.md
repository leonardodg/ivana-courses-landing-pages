# Ivana Academy - Courses Landing Pages - by LeoDG
## Frontend with Tailwind CSS and DevContainer Environment
Frontend Courses Landing Pages Website to Ivana Academy using Tailwind CSS in a DevContainer environment.

Landing pages for Ivana Academy courses (candles, soap making, and resins), built with a modern, high-performance, and easy-to-maintain stack.

<img width="800" height="600" alt="homepage" src="https://github.com/leonardodg/ivana-courses-landing-pages/blob/main/public/images/homepage.png?raw=true">

---

## Technologies and Tools

### Frontend
| Technology | Version | Role |
|---|---|---|
| **React** | 19 | Declarative UI with functional components and hooks |
| **TypeScript** | 5.8 | Static typing, data contracts, and autocompletion |
| **Vite** | 6 | Ultra-fast bundler (internally built), dev server with HMR |
| **Tailwind CSS v4** | 4.x | Utility-first CSS; integrated as a **Vite plugin** (no postcss.config.js) |
| **@tailwindcss/vite** | 4.x | Official Tailwind v4 ↔ Vite integration; zero-config, automatic tree-shaking |
| **Motion** | 12 | Declarative animations (ex-Framer Motion) |
| **Lucide React** | 0.546 | Typed SVG icons |

### Infrastructure
| Technology | Role |
|---|---|
| **Docker** | Containerization; multi-stage build (node-builder → nginx) |
| **Nginx 1.28 Alpine** | Production web server; serves static files from `dist/` |
| **Nginx (proxy)** | Separate container; SSL termination, rate-limit, HTTP→HTTPS redirect |
| **Docker Compose** | Local and production orchestration; `production` profile activates the proxy |

## 📋 Features
- ⚡ **Rapid development** Frontend with Tailwind CSS
- 🔄 **Auto-reload** for CSS changes
- 🐳 **DevContainer** for consistent development environment
- 📱 **Responsive design** ready for use
- 🔌 **Port forwarding** configured for easy localhost access


## Arquitetura

```
VPS (Ubuntu)
└── Docker Engine
    ├── container: ivana-academy-proxy  (nginx:1.28-alpine)
    │     port 80  → redirect HTTPS
    │     port 443 → SSL termination → upstream ivana_app:8088
    │
    └── container: ivana-academy-app   (nginx:1.28-alpine)
          port internal 8088
          /usr/share/nginx/html  ← dist/ build in Vite
```

---

## 🚀 Quick Start

### Prerequisites
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://www.docker.com/products/docker-desktop/)

### Installation and Running

1. Clone this repository:
```bash   
   git https://github.com/leonardodg/ivana-courses-landing-pages.git
   cd ivana-courses-landing-pages   
```

2. Open the folder in VS Code:
```bash
   code .
```

3. Configuration variables of environment

```bash
cp .devcontainer/env/default.example .env
nano .env
```

Editar:
```env
APP_URL=https://courses.local
APP_ENV=production
```

---

4. Inside the DevContainer, install dependencies and start the server:
```bash
   npm install
   npm run build
```

5. Access the website in your browser:
```   http://localhost:8088   ```
   
## 🛠 Project Structure

```
courses-landing-pages/
├── .devcontainer/
│   ├── bin/
│   │   └── my-entrypoint
│   ├── build/
│   │   └── nginx.Dockerfile
│   ├── compose/
│   │   ├── build-dev.yml
│   │   ├── build-prod.yml
│   │   ├── dev.yml
│   │   └── prod.yml
│   ├── env/
│   │   ├── default.env
│   │   ├── dev.env
│   │   ├── prod.env
│   │   ├── default.example
│   │   ├── dev.example
│   │   └── prod.example
│   ├── nginx/
│   │   ├── courses.conf
│   │   ├── nginx.conf
│   │   └── conf.d/
│   │       └── default.conf
│   ├── devcontainer.json
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions to deploy automation
├── src/
│   ├── components/        # Componentes React (Navbar, CourseGrid, etc.)
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css          # @import "tailwindcss" (Tailwind v4)
│   ├── data.ts
│   └── types.ts
├── dist/                     # Code final - Published 
│   ├── index.html
│   ├── candles/
│   │   └── index.html
│   ├── soap/
│   │   └── index.html
├── .gitignore
├── README.md               # This file
├── package.json            # Dependencies and npm scripts and TailwindCSS CLI (build)
├── vite.config.ts
└── tsconfig.json
```
 
## 📦 Comandos Úteis

```bash
# Desenvolvimento local (sem proxy, sem SSL)
npm install
npm run dev                          # Vite HMR em http://localhost:3003

# Build local para inspecionar o dist/
npm run build                        # Preview em http://localhost:8088

# Docker — desenvolvimento
docker compose up

# Docker — produção
docker compose --profile production up -d

# Ver logs
docker compose logs -f web

# Parar tudo
docker compose down
```
 
 ## 🤝 Contributing
 
 <img src="https://avatars.githubusercontent.com/u/1678290?s=400&u=2f875356b82f055057b6e9679c0b66001b9b29f9&v=4" title="LeoDG" >


 ## 📄 License
 This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
 ## 📮 Contact
 
LeoDG - [@leodg](https://leodg.dev)

Github Repository Link: [https://github.com/leonardodg/ivana-courses-landing-pages.git](https://github.com/leonardodg/ivana-courses-landing-pages.git)

Website Link: [https://courses.ivana.academy](https://courses.ivana.academy)
