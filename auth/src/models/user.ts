import mongoose, { mongo } from "mongoose";
import { Password } from "../services/password";
import { InternalServerError } from "../Errors/internal-server-error";
// interface that defines the properties required to create a new user
interface IUserAttributes {
  email: string;
  password: string;
}
// an interface that describest the property a user model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: IUserAttributes): UserDoc;
}

//an interface that describes the properties  that a user docuemnt has

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  //using toJSON to modify the user json document returned while user creation
  {
    toJSON: {
      transform(doc, ret) {
        //doc is the actual doc that will be passed, and ret will be the returned document
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  //first creation will also be considered as modification
  if (this.isModified("password")) {
    try {
      const hashedPassword = Password.toHash(this.get("password"));
      console.log(hashedPassword);
      this.set("password", hashedPassword);
    } catch (error) {
      // Throw the error to be caught by the calling function
      throw new InternalServerError("Error hashing password");
    }
  }
  done();
});

//function to create the user
userSchema.statics.build = (attrs: IUserAttributes) => {
  return new User(attrs);
};
//assigning generics for model function
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
