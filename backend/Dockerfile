FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p public/uploads && chown -R node:node /app

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD node -e "const http=require('http');http.get('http://127.0.0.1:5000/health',res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1));"

USER node
CMD ["npm", "start"]
