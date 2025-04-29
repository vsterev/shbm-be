import cron from "node-cron";
import logger from "../utils/logger";
import CronJobsService from "../services/cronJobs.service";

const initializeCronJobs = () => {
  cron.schedule("30 39 20 * * *", function () {
    const current = new Date();
    logger.info(
      `${current.toString().substring(0, 24)} Cron job - sync Hotels`,
    );
    CronJobsService.getHotels();
  });
};

export default initializeCronJobs;
