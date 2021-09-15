import mongoose from 'mongoose';

const schema = mongoose.Schema(
    {
        body: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
        tweetDate: { type: Date, default: Date.now, required: true },
        stats: {
            views: { type: Number, default: 0, required: true },
            likes: { type: Number, default: 0, required: true },
            retweets: { type: Number, default: 0, required: true },
            response: { type: Number, default: 0, required: true }
        },
    },
    {
        collection: 'tweets',
        strict: 'throw',
        timestamps: true
    }
);

//schema.index({ displayName: 1, fourDigits: 1 }, { unique: true });

export default mongoose.model('Tweet', schema);