import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IAdmin extends Document {
  username: string
  password: string
  comparePassword(candidatePassword: string): Promise<boolean>
}

// Delete the cached model to ensure we use the new schema
if (mongoose.models.Admin) {
  delete mongoose.models.Admin
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving - async function without next()
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare password method
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin
