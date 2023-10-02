### How to start locally in development mode
  1. `git clone https://github.com/joelhackinen/projecthub.git`
  2. `cd projecthub`
  3. `npm --prefix ./react-app ci` (needed only when launching for the first time after cloning/pulling)
  4. `docker compose up -d --build`
  5. application is running at http://localhost:8080/
