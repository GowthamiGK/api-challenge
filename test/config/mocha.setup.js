const { server } = require("../../server.js");

// before(async () => {
//   console.log('RUNNING')
//   return Promise.resolve()
// })

after(async () => {
  return new Promise((resolve, reject) => {
    server.stopRun(() => {
      resolve();
    });
  });
});
