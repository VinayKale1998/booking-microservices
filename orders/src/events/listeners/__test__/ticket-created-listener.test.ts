import { natsWrapper } from "../../../__mocks__/nats-wrapper";
import { TicketCreatedEvent } from "@vr-vitality/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose, { set } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket-model";

const setup = async () => {
  //create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  //create a fake data event

  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  //create a fake message object
  //we don't really need a good message mock
  const msg: Message = {
    ack: jest.fn(),
  } as unknown as Message;

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // call the onmessage function with the data Object + message object
  await listener.onMessage(data, msg);
  //write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
it("it acks the message", async () => {
  const { listener, data, msg } = await setup();
  // call the onmessage function  twice with the data Object + message object, change the ticket id for the second onMessage call
  await listener.onMessage(data, msg);

  //change the id of the data object ,because the second ticket cannot be saved with the same id
  data.id = new mongoose.Types.ObjectId().toHexString();
  await listener.onMessage(data, msg);

  //write assertions to make sure a ticket was created!
  expect(msg.ack).toHaveBeenCalledTimes(2);
});
