FROM node:18-slim

# Install chromium and system libraries required for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "start"]
