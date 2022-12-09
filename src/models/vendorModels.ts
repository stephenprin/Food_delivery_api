import {DataTypes, Model} from  'sequelize'
import {db} from "../config"
import { FoodInstance } from './foodModel';

export interface VendorAttribute{
    id:string;
    name:string;
    resturantName:string;
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
    salt:string;
    serviceAvailable:boolean;
    rating:number;
    role: string;
    coverImage:string;
    
}

export class VendorInstance extends Model<VendorAttribute>{}

VendorInstance.init({
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
   pincode:{
    type:DataTypes.STRING,
    allowNull:true,
   },
   name:{
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
   rating:{
    type:DataTypes.NUMBER,
    allowNull:false,
    
   },
 
   resturantName:{
    type:DataTypes.STRING,
    allowNull:true
   },
   serviceAvailable:{
    type:DataTypes.BOOLEAN,
    allowNull:true,
   },
   role:{
    type:DataTypes.STRING,
    allowNull:true
    },
    coverImage: {
        type: DataTypes.STRING,
        allowNull: true
        
    }
},
{
    sequelize:db,
    tableName:"vendor"
}

)


VendorInstance.hasMany(FoodInstance, {foreignKey: "vendorId", as: 'food'})

FoodInstance.belongsTo(VendorInstance, {foreignKey:"vendorId", as:"vendor"})