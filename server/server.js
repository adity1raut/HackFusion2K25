import express from 'express';
import bodyParser from 'body-parser';
import ConnectDB from "./db/ConnectDB.js";
import userLogin from "./routes/LoginRoute.js";
import useSignin from "./routes/SignUpRoute.js";
import useForgetPass from "./routes/ForgetPassRoute.js";
import useComplaint from "./routes/CompleteRoute.js";
import env from 'dotenv';
import cors from "cors";

env.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

ConnectDB();

app.use(userLogin);
app.use(useSignin);
app.use(useForgetPass);
app.use(useComplaint);


const PORT = 4000 ;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});