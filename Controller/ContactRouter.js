const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const contactsModel = require('../Models/ContactModel')
const { cleanUpAndValidate } = require('../utils/AuthUtils')
mongoose.connect(process.env.mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((res) => {
        console.log("Connected to the database");
    }).catch((error) => {
        console.log(error.message);
    })


//Add new contact
router.post('/add_contact', async (req, res) => {
    const body = req.body;
    const { name, phoneNo, email } = body
    // checkfor missing contactname


    if (!name) {
        return res.send({
            status: 401,
            message: "Missing contact name"
        })
    }

    // checkfor missing email
    if (!email) {
        return res.send({
            status: 401,
            message: "email address missing ,email is required"
        })
    }
    try {
        await cleanUpAndValidate({ email, phoneNo, name })
    } catch (error) {
        return res.send({
            status: 404,
            error: error
        })
    }

    // check if email already exist

    try {
        const contactEmail = await contactsModel.findOne({ email: email })
        if (contactEmail) {
            return res.send({
                status: 402,
                message: "Email already exist, Please use different email"
            })
        }
    } catch (error) {
        return res.send({
            status: 400,
            message: "Data base error, Please try again"
        })
    }

    const contactModel = new contactsModel({
        name: name,
        phoneNo: phoneNo,
        email: email
    })

    try {
        const contact = await contactModel.save()
        return res.send({
            status: 200,
            data: contact,
            message: "Contact saved successfully"
        })
    } catch (error) {
    }
    return res.send({
        status: 400,
        message: "Data base error, Please try again"
    })
})

//Modifying an existing contact

router.post('/edit_contact', async (req, res) => {

    const email = req.body.email;
    const newData = req.body.newData
    if (!email || !newData) {
        return res.send({
            status: 404,
            message: "Missing params",
            error: "data missing"
        })
    }

    try {
        const oldContact = await contactsModel.findOneAndUpdate({ email: email }, newData)
        return res.send({
            status: 200,
            message: 'contact updated successfully',
            data: oldContact
        })
    } catch (error) {
        return res.send({
            status: 400,
            message: 'Data base Error',
            error: error.message
        })
    }

})

//Deleting a contact

router.post('/delete_contact', async (req, res) => {

    const email = req.body.email;
    if (!email) {
        return res.send({
            status: 404,
            message: "Missing params",
            error: "data missing"
        })
    }


    try {
        const deletedContact = await contactsModel.findOneAndDelete({ email: email })
        return res.send({
            status: 200,
            message: 'contact deleted successfully',
            data: deletedContact
        })
    } catch (error) {
        return res.send({
            status: 400,
            message: 'Data base Error',
            error: error.message
        })
    }

})


//Get all contacts 
router.get('/get_all_contact', async (req, res) => {
    const LIMIT = 10;//Read first 10 contacts
    let skip = req.query.skip || 0;
    try {
        const allContact = await contactsModel.aggregate(
            [
                {
                    $facet: {
                        data: [{ $skip: parseInt(skip) }, { $limit: LIMIT }]
                    }
                }
            ]
        )
        return res.send({
            status: 200,
            message: 'contact fetched successfully',
            data: allContact
        })
    } catch (error) {
        return res.send({
            status: 400,
            message: 'Data base Error',
            error: error.message
        })
    }

})

//Search a contact by name or email address

router.get('/search_contact', async (req, res) => {
    const LIMIT = 10;//Read first 10 contacts
    const skip=req.query.skip || 0
    try {
        const allContact = await contactsModel.find(
            { $or: [{ name: { '$regex': req.query.match } }, { email: { '$regex': req.query.match } }] }
        ).limit(LIMIT).skip(skip)
        return res.send({
            status: 200,
            message: 'contacts fetched successfully',
            data: allContact
        })
    } catch (error) {
        return res.send({
            status: 400,
            message: 'Data base Error',
            error: error.message
        })
    }

})
router.get('/', (req, res) => {
    res.send({
        staus: 200,
        message: "connection successful to get all contact"
    })
})

module.exports = router