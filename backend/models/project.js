import mongoose from "mongoose";

const { Schema } = mongoose;

const teamAssignmentSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    roleInProject: {
      type: String,
      trim: true,
    }, // e.g. "Lead", "Backend Developer"
    assignedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const milestoneSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: Date,
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    projectType: {
      type: String,
      required: true,
      trim: true,
    },

    projectLogo: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "On Hold", "Completed", "Cancelled"],
      default: "Active",
    },

    totalCost: {
      type: Number,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      default: 0,
    },

    startDate: Date,
    endDate: Date,

    team: [teamAssignmentSchema],
    milestones: [milestoneSchema],
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ client: 1, status: 1 });
projectSchema.index({
  projectName: "text",
  clientName: "text",
  projectType: "text",
});

const Project = mongoose.model("Project", projectSchema);

export default Project;