const express=require('express')
const app=new express();

const router=require('./src/routes/api')

const rateLimit=require('express-rate-limit')
const helmet=require('helmet')
const hpp=require('hpp')
const mongoSanitize=require('express-mongo-sanitize')
const xss=require('xss-clean')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const mongoose=require('mongoose')
const path=require('path')

app.use(helmet())
app.use(mongoSanitize());
app.use(xss())
app.use(cors())
app.use(cookieParser())
app.use(hpp())

app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb'}))

const limiter=rateLimit({windowMs:15*60*1000,max:3000})
app.use(limiter);


//database Connection Before Routing
let URL='mongodb+srv://mongoShakib:<password>@cluster0.gtiw82u.mongodb.net/Ecommerce';
let OPTION={user:'mongoShakib',pass:'mongoShakib69',autoIndex:true};

mongoose.connect(URL,OPTION).then((res)=>{
    console.log('Database conneted successfully')
}).catch((err)=>{
    console.log(err)
})

app.set('etag',false);
app.use('/api/v1',router)
//directing the control to the frontend
app.use(express.static('client/dist'));

//react front end routing
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
})

module.exports=app;




