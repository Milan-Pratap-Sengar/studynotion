const { contactUsEmail } = require("../mail/templates/contactUsResponse")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
    const { email, firstname, lastName, message, phoneNo, countrycode } = req.body
    console.log(email, firstname, lastName, message, phoneNo, countrycode)
    try {
        const emailRes = await mailSender(  email,
                                            "Your Message send successfully",
                                            contactUsEmail(email, firstname, lastName, message, phoneNo, countrycode)
                                        )
        console.log("Email Res ", emailRes)
        return res.status(200).json({
            success: true,
            message: "Email send successfully",
        })
    } catch (error) {
        console.log("Error", error)
        console.log("Error message :", error.message)
        return res.status(500).json({
            success: false,
            err:error.message,
            message: "Something went wrong...",
        })
    }
}