# Build kedua frontend lalu serve lewat Nginx.
# Build context: root repo (lihat deploy/docker-compose.yml).

FROM node:24-alpine AS build
WORKDIR /src

COPY frontend-employee/package.json frontend-employee/package-lock.json frontend-employee/
COPY frontend-admin/package.json frontend-admin/package-lock.json frontend-admin/
RUN cd frontend-employee && npm ci --no-audit --no-fund \
 && cd ../frontend-admin && npm ci --no-audit --no-fund

COPY frontend-employee frontend-employee
COPY frontend-admin frontend-admin

# VITE_API_URL kosong = request ke origin yang sama (/api, /socket.io),
# lalu diteruskan Nginx ke container api. Build tidak perlu tahu IP/domain VPS.
RUN for app in frontend-employee frontend-admin; do \
      printf 'VITE_API_URL=\n' > "$app/.env.production.local" \
      && (cd "$app" && npm run build) || exit 1; \
    done

FROM nginx:1.27-alpine
COPY deploy/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/web/proxy-api.conf /etc/nginx/snippets/proxy-api.conf
COPY --from=build /src/frontend-employee/dist /usr/share/nginx/html/employee
COPY --from=build /src/frontend-admin/dist /usr/share/nginx/html/admin

EXPOSE 80 8080
