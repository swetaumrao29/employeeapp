const express = require('express')
const app = express()
 const bodyParser = require('body-parser')
 const mongoose = require('mongoose')
 require('./Employee')

 app.use(bodyParser.json())
 const Employee = mongoose.model("employee")


 const mongoUri = "mongodb+srv://cnq:CtmHNnm1NPHgiOrF@cluster0-25uyh.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("connected to mongo yeahhh")
})

mongoose.connection.on("error",(err)=>{
    console.log("error")
})

 app.get('/',(req,res)=>{
    Employee.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
})



app.post('/send-data',(req,res)=>{
   const employee = new Employee({
       name:req.body.name,
       email:req.body.email,
       phone:req.body.phone,
       picture:req.body.picture,
       salary:req.body.salary,
       position:req.body.position
    })
     employee.save()
     .then(data=>{
         console.log(data)
         res.send(data)
     }).catch(err=>{
         console.log(err)
     })

})

app.post('/delete',(req,res)=>{
    Employee.findByIdAndRemove(req.body.id)
    .then(data=>{
        console.log(data)
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
})


app.post('/update',(req,res)=>{
    Employee.findByIdAndUpdate(req.body.id,{
        name:req.body.name,
       email:req.body.email,
       phone:req.body.phone,
       picture:req.body.picture,
       salary:req.body.salary,
       position:req.body.position
    }).then(data=>{
        console.log(data)
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
})
 app.listen(3000,()=>{
      console.log("server running")
 
 })