import { rest } from "msw";

let questions = [
  {
    id: 1,
    prompt: "lorem testum 1",
    answers: ["A", "B", "C", "D"],
    correctIndex: 0,
  },
  {
    id: 2,
    prompt: "lorem testum 2",
    answers: ["E", "F", "G", "H"],
    correctIndex: 1,
  },
];

export const handlers = [
  rest.get("/questions", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(questions));
  }),

  rest.post("/questions", async (req, res, ctx) => {
    const body = await req.json();
    const newQuestion = { ...body, id: Date.now() };
    questions.push(newQuestion);
    return res(ctx.status(201), ctx.json(newQuestion));
  }),

  rest.delete("/questions/:id", (req, res, ctx) => {
    const { id } = req.params;
    questions = questions.filter((q) => q.id !== Number(id));
    return res(ctx.status(200));
  }),

  rest.patch("/questions/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();
    questions = questions.map((q) =>
      q.id === Number(id) ? { ...q, correctIndex: body.correctIndex } : q
    );
    return res(ctx.status(200), ctx.json(questions.find((q) => q.id === Number(id))));
  }),
];
