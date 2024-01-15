import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface ITickerAttrs {
  title: string;
  price: number;
  userId: string;
}

export interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build: (attrs: ITickerAttrs) => ITicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);
//sets the default __v to version
ticketSchema.set("versionKey", "version");

ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs: ITickerAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

export { Ticket };
