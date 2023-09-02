import express from 'express'
import { dbConnect } from './services/Database'
import App from './services/ExpressApp'

const startServer = async () => {
    const app = express()

    await dbConnect();

    await App(app);



    app.listen(8000, () => {
        console.log('App is listening on port 8000')
    })

}

startServer()