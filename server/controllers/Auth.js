const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');


//sendOTP
exports.sendOTP = async (req, res) => {
    try{
        const {email} = req.body;
        // check  if user already exists
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User already registered"});
        }
        // generate OTP
        var otp = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets : false,specialChars: false});
        console.log("OTP generated",otp);
        // check unique otp or not
        let result = await OTP.findOne({otp: otp});
        while(result){
            otp = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets : false,specialChars: false});
            console.log("OTP generated",otp);
            result = await OTP.findOne({otp: otp});
        }
        // save otp to database
        const otpPayload = {email,otp};
        // create an entry in db
        const otpBody = await OTP.create(otpPayload);
        console.log("otpBody",otpBody);
        // reuturn response 
        res.status(200).json({  
            success: true,
            message: "OTP sent successfully",
            otp,
        });
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


//signUp
exports.signUp = async (req, res) => {
    // data fetch from request
    const{
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        conctactNumber,
        otp,
    } = req.body;
    //validate data
    if(!firstName || !lastName || !email || !password || !confirmPassword   || !otp){
        return res.status(403).json({
            success: false,
            message: "All fields are required",
        });
    }
    // match both password 
    if(password !== confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Password do not match",
        });
    }

    // checck user already exists
    const exisitingUser = await User.findOne({email});
    if(exisitingUser){
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
    }

    // find most recent OTP for the user
    const recentOTP = await OTP.findOne({email}).sort({createdAt: -1}).limit(1);
    // validate OTP
    // hash password
    //create entry in DB
    // return response
};
//Login

//changePassword

