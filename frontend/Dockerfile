FROM node:20.10 as build

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

FROM node:21-alpine3.17

WORKDIR /app

COPY --from=build /app/build ./build

RUN yarn global add serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]