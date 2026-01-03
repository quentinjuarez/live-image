const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: false,
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "events",
  }
);

// Index for efficient querying by code
eventSchema.index({ code: 1, createdAt: -1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
