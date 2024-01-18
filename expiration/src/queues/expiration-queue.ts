import Queue from "bull";

interface Payload {
  orderId: string;
}
const expirationQueue = new Queue<Payload>("Order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  try {
    console.log(
      "I want to publish an expiration:complete event for orderId",
      job.data.orderId
    );
  } catch (err) {
    console.log(err);
  }
});

export { expirationQueue };
