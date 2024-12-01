FROM node:latest

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG PORT=8081
ENV PORT=$PORT
EXPOSE $PORT

COPY ./ ./
COPY .env.production .env

RUN npm i --include=dev
RUN npx expo export

CMD ["npx", "serve", "dist"]