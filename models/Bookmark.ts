import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBookmark extends Document {
  title: string
  url: string
  description: string
  category: 'tools' | 'libraries' | 'reads' | 'design' | 'inspiration' | 'other'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const BookmarkSchema: Schema = new Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    url: { type: String, required: [true, 'URL is required'], unique: true, trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['tools', 'libraries', 'reads', 'design', 'inspiration', 'other'],
      default: 'other',
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
)

const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema)

export default Bookmark
