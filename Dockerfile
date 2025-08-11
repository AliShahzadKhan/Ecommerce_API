FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

FROM gcr.io/distroless/nodejs20

WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000

CMD [ "app.js" ]
