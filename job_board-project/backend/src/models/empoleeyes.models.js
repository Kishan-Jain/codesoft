import {Schema, connection, model} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const EmployeeSchema = new Schema({
    emailId : {
        type : String,
        required : [true, "EmailId is required"],
        unique : [true, "EmailId already exits"]
    },
    fullName : {
        type : String,
        required : [true, "FullName is required"]
    },
    password : {
        type : String,
        required : [true, "EmailId is required"],
    },
    companyDetails : {
        name : {
            type:String,
            required:true
        },
        department : {
            type:String
        },
        position : {
            type:String
        },
        joinDate : {
            type:Date
        },

    },
    lastLogin : {
        type : Date
    },
    lastLogout : {
        type : Date,
    },
    isActive : {
        type : Boolean,
        default: true
    },
    avatar : {
        type : String,
    },
    connectionsWithEmployees : [{
        type : Schema.Types.ObjectId,
        ref : "Employee"
    }],
    connectionsWithCandidates : [{
        type : Schema.Types.ObjectId,
        ref : "Candidate"
    }],
    followingByEmployees : [{
        type : Schema.Types.ObjectId,
        ref : "Employee"
    }],
    followingByCandidates : [{
        type : Schema.Types.ObjectId,
        ref : "Candidate"
    }],    
    followrdEmployees : [{
        type : Schema.Types.ObjectId,
        ref : "Employee"
    }],
    followrdCandidates : [{
        type : Schema.Types.ObjectId,
        ref : "Candidate"
    }],
    
    chatBox : [{
        connectionId : {
            type : String
        },
        chat : {
            receivedMessage : [{
                message : String,
                time : Date
            }],
            sendMessage : [{
                message : String,
                time : Date
            }]
        }
    }],
    jobsArray : [{
            type : Schema.Types.ObjectId,
            ref : "Job"
    }],
    previewJobsArray : [{
            type : Schema.Types.ObjectId,
            ref : "Job"
    }]
}, {timestamps:true})

// save password with hash
EmployeeSchema.pre("save", async function(next){
    if(this.isModified("password")) (
        this.password = await bcrypt.hash(this.password, 10)
    )
    next()
})

// custom methods for utilities of schemas
// check password is correct
EmployeeSchema.methods.checkPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// generate AccessRefreshTokens
EmployeeSchema.methods.generateAccessToken() = async function () {
    return await jwt.sign({
        _id : this._id,
        email : this.emailId
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
EmployeeSchema.methods.generateRefreshToken() = async function () {
    return await jwt.sign({
        _id : this._id,
        email : this.emailId,

    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

// models
const Employee = model("Employee", EmployeeSchema)
export default Employee
