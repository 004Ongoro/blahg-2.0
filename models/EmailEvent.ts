import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEmailEvent extends Document {
  type: string
  resendId: string
  from: string
  to: string[]
  subject: string
  data: any
  createdAt: Date
}

const EmailEventSchema: Schema = new Schema(
  {
    type: { type: String, required: true },
    resendId: { type: String, required: true },
    from: { type: String },
    to: { type: [String], default: [] },
    subject: { type: String },
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const EmailEvent: Model<IEmailEvent> = mongoose.models.EmailEvent || mongoose.model<IEmailEvent>('EmailEvent', EmailEventSchema)
export default EmailEvent
