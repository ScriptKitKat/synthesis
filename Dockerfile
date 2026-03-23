FROM node:22-alpine

# Install wget for health checks (required by Locus Build)
RUN apk add --no-cache wget

WORKDIR /app

# Install serve to host static files
RUN npm install -g serve

COPY . .

EXPOSE 8080

# Serve on PORT env var (Locus injects PORT=8080)
CMD ["serve", "-s", ".", "-l", "8080"]
