import express, {Request,Response,NextFunction} from 'express';
import {  AddFood, GetFoods, GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controllers/index';
import { Authenticate } from '../middleware';

import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const uploadStorage = multer({storage : storage}).array('images',10)

const router = express.Router();


router.post('/login',VendorLogin)

router.use(Authenticate)
router.get('/profile',GetVendorProfile)
router.put('/profile',UpdateVendorProfile)
router.put('/service',UpdateVendorService)
router.post('/food',uploadStorage,AddFood)
router.get('/foods',GetFoods)

router.get('/',(req : Request,res : Response , next : NextFunction) => {
    res.json({message : 'hello from Vendor'})
})

export {router as VendorRoute}