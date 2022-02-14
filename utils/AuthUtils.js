const validator = require('validator')

const cleanUpAndValidate = ({ email, phoneNo, name }) => {

    return new Promise((resolve, reject) => {
        if (typeof (email) != 'string')
            reject("Invalid email")
        if (typeof (name) != 'string')
            reject("Invalid name")
        if (typeof (phoneNo) != 'string')
            reject("Invalid phone no")
        if (!validator.isEmail(email)) {
            reject("Invalid Email")
        }
        if (phoneNo.length > 10)
            reject("too long phone no")
        if (phoneNo.length > 10)
            reject("too short phone no")
        if (!phoneNo || !email || !name)
            reject("Invalid data")
        if (name.length < 3)
            reject("Name too short")
        if (name.length > 30)
            reject("Name too long")
        if (email.length < 3)
            reject("Email too short")
        if (email.length > 40)
            reject("Email too long")
        resolve()
    })
}
module.exports={cleanUpAndValidate}