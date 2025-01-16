import Redis from "ioredis"

const client = new Redis()

client.on('connect',()=>{
    console.log('Connected to redis');
})

client.on('error',(err)=>{
    console.log('Connection error in redis: ',err);
})

export default client;
