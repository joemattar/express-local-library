const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.first_name} ${this.family_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Virtual for formatted date of birth datetime with LUXON library
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  if (this.date_of_birth) {
    return DateTime.fromJSDate(this.date_of_birth).toFormat("yyyy");
  }
  return "NA";
});

// Virtual for formatted date of death datetime with LUXON library
AuthorSchema.virtual("date_of_death_formatted").get(function () {
  if (this.date_of_death) {
    return DateTime.fromJSDate(this.date_of_death).toFormat("yyyy");
  }
  return "NA";
});

// Virtual for formatted date of birth datetime with LUXON library
AuthorSchema.virtual("date_of_birth_formatted_ymd").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toFormat("yyyy-MM-dd");
});

// Virtual for formatted date of death datetime with LUXON library
AuthorSchema.virtual("date_of_death_formatted_ymd").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toFormat("yyyy-MM-dd");
});

// Virtual for lifespan
AuthorSchema.virtual("lifespan").get(function () {
  if (this.date_of_birth && this.date_of_death) {
    return `( ${DateTime.fromJSDate(this.date_of_birth).toFormat(
      "yyyy"
    )} - ${DateTime.fromJSDate(this.date_of_death).toFormat("yyyy")} )`;
  } else if (this.date_of_birth) {
    return `( b: ${DateTime.fromJSDate(this.date_of_birth).toFormat("yyyy")} )`;
  } else {
    return "( N/A )";
  }
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
