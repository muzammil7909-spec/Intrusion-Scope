import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: [true, 'Please provide a title for the blog'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  cveId: {
    type: String, unique: true
  },
  product: {
    type: String,
  },
  cwes: [String],
  classification: String,
  vendorProject: String,
  metaTitle: String,
  metaDescription: String,
  openGraph: {
    title: String,
    description: String,
    type: { type: String, default: 'article' },
    imageAlt: String,
  },
  jsonLd: {
    articleSchema: mongoose.Schema.Types.Mixed,
    faqSchema: mongoose.Schema.Types.Mixed,
  },
  tableOfContents: [{
    level: Number,
    title: String,
  }],
  dateDisclosed: {
    type: Date,
  },
  remediationDeadline: {
    type: Date,
  },
  shortDescription: {
    type: String,
    required: [true, 'Please provide a short description'],
    maxlength: [500, 'Short description cannot be more than 500 characters'],
  },
  keywords: [String],
  faq: [{
    question: String,
    answer: String,
  }],
  data: {
    type: String,
    required: [true, 'Please provide the blog content'],
  },
  published: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
