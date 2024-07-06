const mongoose=require('mongoose');
const {Schema}=mongoose;


const userSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    date:{
        type:Date,
        default:Date.now
    }
  });

//mongoose.model is a method provided by Mongoose to create a model from a schema.
const User=mongoose.model('user',userSchema);
User.createIndexes();
module.exports=User;