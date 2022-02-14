const mongoose= require('mongoose')
const schema= mongoose.Schema

const contactSchema=new schema({
    name:{
        type:String,
        required:true
    },
    phoneNo:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
})

module.exports=mongoose.model('contact',contactSchema)