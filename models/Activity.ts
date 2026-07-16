import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IActivity extends Document {
  content: string
  category: 'working' | 'learning' | 'reading' | 'listening' | 'playing' | 'general'
  emoji: string
  createdAt: Date
  updatedAt: Date
}

const ActivitySchema: Schema = new Schema(
  {
    content: { type: String, required: [true, 'Content is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['working', 'learning', 'reading', 'listening', 'playing', 'general'],
      default: 'general',
    },
    emoji: { type: String, trim: true, default: '📍' },
  },
  { timestamps: true }
)

const Activity: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema)

export default Activity
