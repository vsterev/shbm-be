import mongoose from "mongoose";
import envConfig from "./envVariables";

const dbConnect = () => {
  if (!envConfig.MONGO_URL) {
    throw new Error(
      "MONGO_URL is not defined in the environment configuration",
    );
  }
  return mongoose.connect(envConfig.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};
export default dbConnect;
