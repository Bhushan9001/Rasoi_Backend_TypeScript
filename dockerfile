FROM node:20-alpine    
#for adding the node image in hosts container

WORKDIR /app   
#works as directory to store all the files and folders on the folder that we want convert into image 

COPY package* .
COPY ./prisma .
#this file aare not often changed so ideas is to chache this layer 
ENV DATABASE_URL = " "
RUN npm install
# this commands are depends on the changes in package or prisma file so this layer is  also cached 

COPY . .

#copy all the files in app directory 

RUN npm run build
#this command will help to convert ts files to js 

EXPOSE 8080
#the port that porject is running on 

CMD npx prisma migrate deploy && npm start

#the command to start the express backend 


