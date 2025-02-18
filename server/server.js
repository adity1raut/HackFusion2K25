import express from 'express';
import bodyParser from 'body-parser';
import ConnectDB from "./db/ConnectDB.js";
import userLogin from "./routes/LoginRoute.js";
import useSignin from "./routes/SignUpRoute.js";
import useForgetPass from "./routes/ForgetPassRoute.js";
import useElection from "./routes/ElectionRoute.js"
import useComplaint from "./routes/CompleteRoute.js"
import useElectionCandidate from "./routes/Election/ElectionRegistatonRoute.js"
import useBooking  from "./routes/BookingRoute.js"
import env from 'dotenv';
import cors from "cors";


env.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());

ConnectDB();

app.use(userLogin);
app.use(useSignin);
app.use(useForgetPass);
app.use(useComplaint);
app.use(useElection);
app.use(useElectionCandidate)
app.use(useBooking)


const PORT = 4000 ;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});