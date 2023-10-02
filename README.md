### How to start
1. `git clone https://github.com/joelhackinen/projecthub.git`
2. `cd projecthub`

#### in development mode
3. `npm --prefix ./react-app ci` (needed only when launching for the first time after cloning/pulling)
4. `docker compose up -d --build`
5. application is running at http://localhost:8080/
  
#### ...and in production mode
3. `docker compose -f docker-compose.prod.yml up -d --build`
4. application is running at http://localhost:8080/
