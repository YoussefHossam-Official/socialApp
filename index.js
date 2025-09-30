import express from "express";
import { config } from "dotenv";
import * as AllRouter from './modules/index.routes.js'
import { failResHandle } from "./utils/errorhandling.js";
import { connectionDB } from "./Db/connection.js";
const app = express();
config({ path: "./config/dev.env" });
connectionDB()
app.use(express.json());
const port = process.env.PORT;

const baseUrl = process.env.BASE_URL;

app.use(`${baseUrl}/user`,AllRouter.userRouter);
app.use(`${baseUrl}/post`,AllRouter.postRouter);
app.use(`${baseUrl}/comment`,AllRouter.commentRouter);
app.get("/", (req, res) => res.send("Hello World!"));




app.all('*',(req,res,next) =>{
    res.status(400).json({message:'page not found'})
}) 

// handle fail response
app.use(failResHandle)



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
