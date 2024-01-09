import nats, { Stan } from "node-nats-streaming";

//singleton class
class NatsWrapper {
  private _client?: Stan;

  //this will be called like natsWrapper.client and not natsWrapper.client(), as this is  a getter
  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS  client before conencting");
    }

    return this._client;
  }
  connect(cluserId: string, clientId: string, url: string) {
    this._client = nats.connect(cluserId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("connected to NATS");
        resolve();
      });

      this._client!.on("error", (err) => {
        console.log("failed to conenct to nats");
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
