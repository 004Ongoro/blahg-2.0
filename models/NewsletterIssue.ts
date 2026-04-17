import mongoose, { Schema, Document, Model } from 'mongoose'

export interface INewsletterIssue extends Document {
  subject: string
  content: string
  isMarkdown: boolean
  slug: string
  published: boolean
  createdAt: Date
}

const NewsletterIssueSchema: Schema = new Schema(
  {
    subject: { type: String, required: true },
    content: { type: String, required: true },
    isMarkdown: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const NewsletterIssue: Model<INewsletterIssue> = 
  mongoose.models.NewsletterIssue || mongoose.model<INewsletterIssue>('NewsletterIssue', NewsletterIssueSchema)

export default NewsletterIssue