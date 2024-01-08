import mongoose from "mongoose";

const id1 = new mongoose.Types.ObjectId();

const id2 = new mongoose.Types.ObjectId().toString();

console.log(id1); //new ObjectId('658a4fd265a91820615a5a31')
console.log(id2); //658a4fd265a91820615a5a32

console.log(mongoose.Types.ObjectId.isValid(id1)); //true
console.log(id1.toString() === id1.toHexString()); //true
console.log(mongoose.Types.ObjectId.isValid(id2)); //true
