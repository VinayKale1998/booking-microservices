import { natsWrapper } from "../../../__mocks__/nats-wrapper";
import { TicketUpdatedEvent } from "@vr-vitality/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket-model";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  //create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // let's create a ticket first and save it first
  const originalTicket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "original",
    price: 10,
  });

  await originalTicket.save();
  //create a fake data event

  const data: TicketUpdatedEvent["data"] = {
    version: originalTicket.version + 1,
    id: originalTicket.id,
    title: "updated",
    price: 11,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  //create a fake message object
  //we don't really need a good message mock
  const msg: Message = {
    ack: jest.fn(),
  } as unknown as Message;

  return { listener, data, msg, originalTicket };
};

it("finds, updates the ticket upon calling the onMessage fn", async () => {
  const { listener, data, msg, originalTicket } = await setup();

  // call the onMessage event with the data and msg objects
  await listener.onMessage(data, msg);

  //assert with the documents in the tickets collection
  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.version).toEqual(originalTicket.version + 1);
});

it("it acks the message", async () => {
  const { listener, data, msg } = await setup();
  // call the onmessage function  twice with the data Object + message object, change the ticket id for the second onMessage call
  await listener.onMessage(data, msg);

  // cannot call the onMessage for the update listener on the data with the same version
  //we can if you change the version by adding one and then asserting two ack calls

  //write assertions to make sure a ticket was created!
  expect(msg.ack).toHaveBeenCalled();
});

it("throws an error if listen to an event which has an out of order version and doesn't call ack", async () => {
  const { listener, data, msg } = await setup();
  // call the onmessage function ,
  await listener.onMessage(data, msg);

  // but increment the version of the data object by two
  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket!.price).toEqual(data.price);

  //now setup for another event, but the event is out of order by 1 version
  data.version = updatedTicket!.version + 2;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    //ticket not found error will be thrown, as mongo will try to find a doc with version equal to data.version-1
    expect(err).toBeDefined();
    // it won't be zero as one update was processed earlier, let's confirm that it's not two
    expect(msg.ack).toHaveBeenCalledTimes(1);
  }
});
