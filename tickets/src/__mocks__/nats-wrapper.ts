import { Stan } from "node-nats-streaming";

export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subect: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  } as unknown as Stan,
};

// initial setup

// export const natsWrapper = {
//     client: {
//       publish: (subject: string, data: string, callback: () => void) => {
//         callback();
//       },
//     },
//   };
