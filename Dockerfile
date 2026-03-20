FROM node:22-alpine

WORKDIR /app

# Install dependencies for scripts
RUN apk add --no-cache bash curl jq

# Copy project files
COPY package*.json ./
RUN npm install --production 2>/dev/null || true

COPY . .

# Simple HTTP server to serve the Signal Scout landing page
RUN npm install -g serve 2>/dev/null || apk add --no-cache python3 && \
    echo '#!/bin/sh' > /start.sh && \
    echo 'exec npx serve -s . -l 8080 2>/dev/null || python3 -m http.server 8080' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
