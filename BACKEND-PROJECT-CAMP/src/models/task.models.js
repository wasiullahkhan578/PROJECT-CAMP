import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      // Using Uppercase to match your toggleTaskStatus logic
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subtasks: [
      {
        title: {
          type: String,
          required: true, 
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);

// Safety check to prevent OverwriteModelError
export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
