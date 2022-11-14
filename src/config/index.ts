import  {Sequelize} from "sequelize"

export const db= new Sequelize('app','','', {
    storage: "./foodDB.sqlite",
    dialect:"sqlite",
    logging:false

})