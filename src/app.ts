import express from 'express'
import cors from 'cors'
import router from "./Routers/Router";
import connect from "./DB/connect";
const port : number | string=  process.env.PORT || 5000;
const app = express();
// app.use(cors({origin: true}))
connect

app.use(express.json())

app.use(router)

app.listen(port, () => {
    console.log('running on ' + port)
})

export default app;