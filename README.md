# Website - ivana-courses-landing-pages - LeoDG
## Frontend with Tailwind CSS and DevContainer Environment
Frontend Courses Landing Pages Website to Ivana Academy using Tailwind CSS in a DevContainer environment.

<img width="800" height="600" alt="homepage" src="https://github.com/leonardodg/ivana-courses-landing-pages/blob/main/src/images/courses.ivana.academy.png?raw=true">


## 📋 Features
- ⚡ **Rapid development** Frontend with Tailwind CSS
- 🔄 **Auto-reload** for CSS changes
- 🐳 **DevContainer** for consistent development environment
- 📱 **Responsive design** ready for use
- 🔌 **Port forwarding** configured for easy localhost access

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

3. When prompted, click "Reopen in Container" or run the command:
   - Press `F1`   - Type "Remote-Containers: Reopen in Container"
   - Press Enter

4. Inside the DevContainer, install dependencies and start the server:
```bash
   npm install
   npm run build
   npm start
```

5. Access the website in your browser:
```   http://localhost:8080   ```
   
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
│       └── deploy.yml          # GitHub Actions para deploy automático
├── public/                      # Código fonte (development)
│   ├── index.html
│   ├── velas/
│   │   └── index.html
│   ├── saboaria/
│   │   └── index.html
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   │   ├── main.js
│   │   │   ├── i18n.js
│   │   │   └── api.js
│   │   └── images/
│   └── translations/
│       ├── pt.json
│       ├── es.json
│       └── en.json
├── docker-compose.yml
├── .gitignore
├── README.md               # This file
├── package.json            # Dependencies and npm scripts and TailwindCSS CLI (build)
├── postcss.config.js       # PostCSS configuration
└── tailwind.config.js      # Tailwind CSS configuration
```
 
 ## 📦 Available Scripts
- ```npm run build``` - Compiles HTML and CSS files for production 
- ```npm run start``` - Starts - the local HTTP server serving the public folder
 
 ## 🤝 Contributing
 
 <img src="https://avatars.githubusercontent.com/u/1678290?s=400&u=2f875356b82f055057b6e9679c0b66001b9b29f9&v=4" title="LeoDG" >


 ## 📄 License
 This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
 ## 📮 Contact
 
LeoDG - [@leodg](https://leodg.dev)

Github Repository Link: [https://github.com/leonardodg/ivana-courses-landing-pages.git](https://github.com/leonardodg/ivana-courses-landing-pages.git)

Website Link: [https://courses.ivana.academy](https://courses.ivana.academy)
