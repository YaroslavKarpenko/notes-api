require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/note");

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (request, response, next) => {
  const { content, important } = request.body;

  if (content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content,
    important: important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      result
        ? response.status(204).end()
        : response.status(400).json({ error: "content missing" });
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((updatedNote) => {
      updatedNote
        ? response.json(updatedNote)
        : response.status(400).json({ error: "content missing" });
    })
    .catch((error) => next(error));
});

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
