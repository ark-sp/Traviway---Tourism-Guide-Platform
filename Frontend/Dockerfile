# Step 1: Build the frontend using Node
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve using Nginx
FROM nginx:alpine

# Copy custom nginx config (for proxying /api to backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
