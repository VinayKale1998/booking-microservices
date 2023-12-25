export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subect: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};

// initial setup

// export const natsWrapper = {
//     client: {
//       publish: (subject: string, data: string, callback: () => void) => {
//         callback();
//       },
//     },
//   };
