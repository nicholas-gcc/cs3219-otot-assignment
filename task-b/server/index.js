import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(express.json( { limit: '50mb', extended: true } ));
app.use(express.urlencoded( { limit: '50mb', extended: true } ));
app.use(cors());

app.use('/posts', postRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;
mongoose.connect(CONNECTION_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        });
    })
    .catch((error) => {
        console.log(error.message);
    })
    
export default app;