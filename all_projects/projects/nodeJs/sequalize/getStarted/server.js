const sequelize = require('./config');
const Customer = require('./models/customer')
const Order = require('./models/Order')

Customer.hasMany(Order);

Customer.create({name:'Rahul das',email:'d1asr@gamail.com'}) // create
.then((resolve,reject)=>{
    if(!reject){
        console.log('resolve');
        resolve.createOrder({total:100})
    }else{
       console.log('reject');
    }
})


    sequelize
        // .sync({force:true})
        .sync()
        .then((result)=>{
            console.log("result");
        }).catch((err)=>{
            console.log(err);
        })