import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  tags: string[]
  readTime: number
  published: boolean
  createdAt: Date
  updatedAt: Date
}

// Delete the cached model to ensure we use the new schema
if (mongoose.models.Post) {
  delete mongoose.models.Post
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: 300,
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: Number,
      default: 1,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Calculate read time and slug before saving - no next() callback
PostSchema.pre('save', function () {
  // Calculate read time
  const wordsPerMinute = 200
  const wordCount = this.content.split(/\s+/).length
  this.readTime = Math.ceil(wordCount / wordsPerMinute)
  
  // Create slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
})

const Post: Model<IPost> = mongoose.model<IPost>('Post', PostSchema)

export default Post
