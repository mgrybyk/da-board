import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
const { Schema } = mongoose

const userSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
  },
  {
    statics: {
      async getAll() {
        return this.find({}, { username: 1, displayName: 1 })
      },
    },
  }
)

userSchema.plugin(passportLocalMongoose, {
  selectFields: 'username displayName',
  usernameLowerCase: true,
})

export const UserModel = mongoose.model('Users', userSchema)
