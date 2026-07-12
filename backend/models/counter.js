import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Generic auto-increment counter, used to produce sequential, human-readable
 * IDs like "CE054" (employees) and "CLT050" (clients) without relying on
 * ObjectIds or racy "find the last doc and +1" logic.
 */
const counterSchema = new Schema({
  _id: {
    type: String,
    required: true,
  }, // e.g. "employeeId", "clientId"
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;