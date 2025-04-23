import mongoose from "mongoose";
import userModel from "../src/models/user";
import config from "../src/config/envVariables";
import CronJobsService from "../src/services/cronJobs.service";

const MONGO_URI = config.MONGO_URL;

async function seedInitialUser() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const existingUser = await userModel.findOne({
      email: "admin@example.com",
    });
    if (!existingUser) {
      const user = new userModel({
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        isAdmin: true,
      });

      await user.save();
      console.log("Admin user created successfully");
    }

    await CronJobsService.getHotels();
    console.log("Cron jobs executed successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedInitialUser();
