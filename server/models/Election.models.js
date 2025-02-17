import mongoose from "mongoose";

const ElectionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    candidates: {
        type: Array,
        required: true,
    },
    status: {
        type: String,
        default: "inactive",
    },
    }, {
    timestamps: true,
});

export default 