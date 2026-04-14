import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISubscriber extends Document {
  email: string
  subscribedAt: Date
  active: boolean
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)

export default Subscriber
