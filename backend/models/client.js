import mongoose from "mongoose";

const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    clientId: {
      type: String, // e.g. "CLT050"
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    alternativePhoneNumber: {
      type: String,
      trim: true,
    },

    // "POC is same as Client" checkbox
    pocSameAsClient: {
      type: Boolean,
      default: false,
    },

    poc: {
      name: {
        type: String,
        trim: true,
      },
      mobileNumber: {
        type: String,
        trim: true,
      },
    },

    aadhaarNo: {
      type: String,
      select: false,
    },

    panNumber: {
      type: String,
      select: false,
    },

    address: {
      type: String,
    },

    location: {
      type: String,
      trim: true,
      default: "N/A",
    },

    clientPhoto: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // Denormalized counters
    totalServices: {
      type: Number,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      default: 0,
    },

    memberSince: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

clientSchema.index({
  clientName: "text",
  email: "text",
  companyName: "text",
});

clientSchema.index({ status: 1 });

// Virtual relationship
clientSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "client",
});

const Client = mongoose.model("Client", clientSchema);

export default Client;