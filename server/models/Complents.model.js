
import mongoose from 'mongoose';

const ComplentsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'approved', 'rejected'],
        default: 'unread'
    }
}, {
    timestamps: true
});

export default mongoose.model('Complents', ComplentsSchema);