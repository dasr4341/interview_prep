import mongoose from "mongoose";
// mongodb provide an id with name -> _id so i am not mentioning the 'id' field in the schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
// registering the model below
mongoose.model('User', userSchema);