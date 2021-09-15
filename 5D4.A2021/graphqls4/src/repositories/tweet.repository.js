import Tweets from '../models/tweet.model.js'

class TweetRepository {
    create(body) {
        const idAccount = '613907a90db8255d347738bc';
        const tweet = new Tweets({ body, author: idAccount });
        return tweet.save();
    }

    retrieveAll() {
        return Tweets.find();
    }

    retrieveById(id) {
        return Tweets.findById(id);
    }

    async likeTweet(id) {
        return Tweets.findOneAndUpdate({ _id: id }, { $inc: { 'stats.likes': 1 } }, { new: true })
    }
}

export default new TweetRepository();