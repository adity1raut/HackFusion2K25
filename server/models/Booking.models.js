
import mongoose from "mongoose";

const BookingSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },  
    phone: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    venue :{
        type: String,
        required: true,
    } ,
    status: {
        type: String,
        default: "unread",
    },
    }, {
    timestamps: true,
});

export default mongoose.model("Booking", BookingSchema);