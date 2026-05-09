import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IGuestbookEntry extends Document {
  name: string
  message: string
  createdAt: Date
}

const GuestbookEntrySchema: Schema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    message: { type: String, required: [true, 'Message is required'], trim: true },
  },
  { timestamps: true }
)

const GuestbookEntry: Model<IGuestbookEntry> = 
  mongoose.models.GuestbookEntry || mongoose.model<IGuestbookEntry>('GuestbookEntry', GuestbookEntrySchema)

export default GuestbookEntry
