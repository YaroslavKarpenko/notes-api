const mongoose = require("mongoose");

const [, , content] = process.argv;
const url = `mongodb+srv://fullstack:123@cluster0.g6rolhc.mongodb.net/testNoteApp?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});
const Note = mongoose.model("Note", noteSchema);
const note = new Note({ content, important: false });

note.save().then(() => {
  console.log(`added content: ${content} to testNotes`);
  mongoose.connection.close();
});
