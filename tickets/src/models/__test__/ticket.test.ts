import { Ticket } from "../ticketmodel";

it("Implements optimistic of concurrency control", async () => {
  //create an instance of a ticket

  const ticket = Ticket.build({
    title: "Standup",
    price: 23,
    userId: "231",
  });
  //save it

  await ticket.save();
  //fetch the ticket twice

  const firstFetch = await Ticket.findById(ticket.id);
  const secondFetch = await Ticket.findById(ticket.id);
  // make two separate chagnes to the tickets we fetched
  firstFetch!.set({ price: 10 });
  secondFetch!.set({ price: 13 });
  // save the frist fetched ticket

  await firstFetch!.save();

  // save the second fetched ticket
  try {
    // an error should be thrown, because we haven't updated the version number earlier

    await secondFetch!.save();
  } catch (err) {
    return;
  }
  throw new Error("Should not reach this pointw");
});

it("Increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "Movie",
    price: 20,
    userId: "23",
  });

  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();

  expect(ticket.version).toEqual(1);

  await ticket.save();

  expect(ticket.version).toEqual(2);
});
