import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  tags: string[]
  published: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { 
      type: String, 
      required: [true, 'Slug is required'], 
      unique: true, 
      trim: true,
      lowercase: true 
    },
    content: { type: String, required: [true, 'Content is required'] },
    excerpt: { type: String, required: [true, 'Excerpt is required'] },
    coverImage: { type: String },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
)

PostSchema.index({ slug: 1 })

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)
export default Post