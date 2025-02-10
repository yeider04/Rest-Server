import mongoose from "mongoose";
import colors from "colors";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("Base de datos online".green);
  } catch (error) {
    console.log(error.red);
    throw new Error("Error a la hora de iniciar la base de datos".red);
  }
};
