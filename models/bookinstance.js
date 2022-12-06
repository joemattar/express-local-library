const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    // This allows us to set the allowed values of a string.
    // In this case, we use it to specify the availability status of our books
    // (using an enum means that we can prevent mis-spellings and arbitrary values for our status).
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    // We use default to set the default status for newly created bookinstances to maintenance
    default: "Maintenance",
  },
  // we set the default due_back date to now (note how you can call the Date function when setting the date!).
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this._id}`;
});

// Virtual for bookinstance's formatted due back time with LUXON library
BookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

// Virtual for bookinstance's formatted due back time for book instance update with LUXON library
BookInstanceSchema.virtual("due_back_formatted_ymd").get(function () {
  return DateTime.fromJSDate(this.due_back).toFormat("yyyy-MM-dd");
});

// Export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);
