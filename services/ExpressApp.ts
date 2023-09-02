import express,{ Application } from 'express'

import { AdminRoute, CustomerRoute, ShoppingRoute, VendorRoute } from '../routes'
import bodyParser from 'body-parser'
import path from 'path'


export default async (app:Application) => {

    app.use(bodyParser.json())

    app.use(bodyParser.urlencoded({ extended: true }))


    app.use('/images', express.static(path.join(__dirname + '/images')))

    app.use('/admin', AdminRoute)
    app.use('/vendor', VendorRoute)
    app.use('/shopping',ShoppingRoute)
    app.use('/customer',CustomerRoute)

    return app;
}