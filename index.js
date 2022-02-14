const express= require('express')
const app=express()
const PORT = process.env.PORT || 5000

const contactRoute= require('./Controller/ContactRouter')

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/contact',contactRoute)
app.get('/',(req,res)=>{
    res.send("welcome to the phonebook service")
})

app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})