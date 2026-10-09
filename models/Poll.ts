import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPollOption {
  id: string
  text: string
  votes: number
}

export interface IPoll extends Document {
  slug: string
  question: string
  options: IPollOption[]
  voterHashes: string[]
  totalVotes: number
  postSlug?: string
  isClosed: boolean
  createdAt: Date
  updatedAt: Date
}

const PollOptionSchema = new Schema<IPollOption>(
  {
    id: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    votes: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
)

const PollSchema = new Schema<IPoll>(
  {
    slug: {
      type: String,
      required: [true, 'Poll slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    question: {
      type: String,
      required: [true, 'Poll question is required'],
      trim: true,
    },
    options: {
      type: [PollOptionSchema],
      validate: {
        validator: (opts: IPollOption[]) => opts && opts.length >= 2,
        message: 'A poll must have at least 2 options',
      },
    },
    voterHashes: {
      type: [String],
      default: [],
    },
    totalVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    postSlug: {
      type: String,
      trim: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

PollSchema.index({ slug: 1 })
PollSchema.index({ postSlug: 1 })
PollSchema.index({ slug: 1, voterHashes: 1 })

const Poll: Model<IPoll> = mongoose.models.Poll || mongoose.model<IPoll>('Poll', PollSchema)

export default Poll
