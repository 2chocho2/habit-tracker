FROM    node  AS builder
RUN     mkdir /my-app
WORKDIR /my-app
ARG     GIT_REPOSITORY_ADDRESS
ARG     REST_API_SERVER_IP
ARG     REST_API_SERVER_PORT
RUN     git clone $GIT_REPOSITORY_ADDRESS
RUN     mv ./habit-tracker/* ./
RUN     echo REACT_APP_IP=$REST_API_SERVER_IP > .env
RUN     echo REACT_APP_PORT=$REST_API_SERVER_PORT >> .env
RUN     npm install -s
RUN     npm run --silent build

FROM    nginx AS runtime
COPY    --from=builder /my-app/build/ /usr/share/nginx/html/
RUN     rm /etc/nginx/conf.d/default.conf
COPY    --from=builder /my-app/nginx.conf /etc/nginx/conf.d                    
CMD     ["nginx", "-g", "daemon off;"]
