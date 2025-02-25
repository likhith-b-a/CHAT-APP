import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    about: {
      type: String,
    },
    sentMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    recievedMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
// userSchema.pre("save",async function (next){
//   if(!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10)
//   next();
// })

// userSchema.methods.isPasswordCorrect = async function (password){
//   return await bcrypt.compare(password, this.password);
// }

// userSchema.methods.generateAccessToken = function(){
//   return jwt.sign(
//     {
//       _id: this.id,
//       email: this.email,
//       name: this.name,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//     }
//   )
// }

// userSchema.methods.generateRefreshToken = function(){
//   return jwt.sign(
//       {
//           _id: this._id,

//       },
//       process.env.REFRESH_TOKEN_SECRET,
//       {
//           expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//       }
//   )
// }
