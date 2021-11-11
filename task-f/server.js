const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Redis = require('redis');

const redisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600;

let app = express();
app.use(cors());

app.get("/photos/redis", async (req, res) => {
  const albumId = req.query.albumId;
  const photos = await getOrSetCache(`photos?albumId=${albumId}`, async () => {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/photos",
      { params: { albumId } }
    )
    return data;
  })
  
  res.json(photos);
})

// get photos without redis cache
app.get("/photos", async (req, res) => {
    const albumId = req.query.albumId;
    const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        { params: { albumId } }
    )
    res.json(data);
});



function getOrSetCache(key, cb) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) return reject(error);
      if (data != null) return resolve(JSON.parse(data)); // cache hit
      const freshData = await cb(); // cache miss
      redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData)); // store data in redis cache with expiration
      resolve(freshData);
    })
  })
}

app.listen(3000);