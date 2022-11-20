import {DataTypes, Model} from  'sequelize'
import {db} from "../config"

export interface UserAttribute{
    id:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    salt:string;
    address:string;
    phone:string;
    otp:number;
    otp_expiry:Date;
    lng:number;
    lat:number
    verified:boolean
    role:string
    
}

export class UserInstance extends Model<UserAttribute>{}

UserInstance.init({
    id:{
        type:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false,
        
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            notNull:{
                msg:"Email provide address"
            },
            isEmail:{
                msg:"Please provide a valid email"
            }
        }
    },
   password:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
        notNull:{
            msg:"Password is required"
        },
        notEmpty:{
            msg:"Please input a password"
        }
    }
   },
   firstName:{
    type:DataTypes.STRING,
    allowNull:true,
   },
   lastName:{
    type:DataTypes.STRING,
    allowNull:true,
   },
   salt:{
    type:DataTypes.STRING,
    allowNull:false,
   },
   address:{
    type:DataTypes.STRING,
    allowNull:true
   },
   phone:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
        notNull:{
            msg:"Provide phone number is required",
        },
        notEmpty:{
            msg:"Provide phone number",
        }
    }
   },
   otp:{
    type:DataTypes.NUMBER,
    allowNull:false,
    validate:{
        notNull:{
            msg:"OTP is required",
        },
        notEmpty:{
            msg:"Provide an OTP",
        }
    }
   },
   otp_expiry:{
    type:DataTypes.DATE,
    allowNull:false,
    validate:{
        notNull:{
            msg:"OTP is required"
        }
    }
   },
   lat:{
    type:DataTypes.NUMBER,
    allowNull:true
   },
   lng:{
    type:DataTypes.NUMBER,
    allowNull:true
   },
   verified:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    validate:{
        notNull:{
            msg:"User must be verfied"
        },
        notEmpty:{
            msg:"User not verified"
        }
        
    }
   },
   role:{
    type:DataTypes.STRING,
    allowNull:true
   }
},
{
    sequelize:db,
    tableName:"user"
}

)
