FROM node:14 AS buildnode
WORKDIR /usr/src/app
COPY ./ ./client
RUN cd client && npm install
RUN npm run build

FROM node:14
WORKDIR /usr/src/app
COPY --from=buildnode /usr/src/app/client /usr/src/app/
EXPOSE 5000
CMD [ "npm", "start" ]