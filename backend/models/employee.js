import mongoose from "mongoose";

const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    employeeId: {
      type: String, // e.g. "CE054"
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    }, // Backend Developer

    department: {
      type: String,
      required: true,
      trim: true,
    }, // Backend

    branch: {
      type: String,
      required: true,
      trim: true,
    }, // Hyderabad

    role: {
      type: String,
      enum: ["Employee", "Team Lead", "Manager"],
      default: "Employee",
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave", "Terminated"],
      default: "Active",
    },

    profileCompletion: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    address: String,

    aadhaarNo: {
      type: String,
      select: false,
    },

    panNumber: {
      type: String,
      select: false,
    },

    bankDetails: {
      accountNumber: {
        type: String,
        select: false,
      },
      ifsc: {
        type: String,
        select: false,
      },
      bankName: String,
    },

    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

employeeSchema.index({
  department: 1,
  status: 1,
});

employeeSchema.index({
  name: "text",
  email: "text",
  designation: "text",
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;