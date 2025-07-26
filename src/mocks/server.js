 
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const questions = [
  { id: 1, prompt: 'lorem testum 1', answers: ['A', 'B', 'C', 'D'], correctIndex: 0 },
  { id: 2, prompt: 'lorem testum 2', answers: ['E', 'F', 'G', 'H'], correctIndex: 1 },
];

export const server = setupServer(
  rest.get('http://localhost:4000/questions', (req, res, ctx) => {
    console.log('GET /questions called');
    return res(ctx.json(questions));
  }),
  rest.post('http://localhost:4000/questions', (req, res, ctx) => {
    console.log('POST /questions called:', req.body); 
    const newQuestion = { id: questions.length + 1, ...req.body };
    questions.push(newQuestion);
    return res(ctx.json(newQuestion));
  }),
  rest.delete('http://localhost:4000/questions/:id', (req, res, ctx) => {
    console.log('DELETE /questions/:id called:', req.params.id); // Debug log
    const id = parseInt(req.params.id);
    const index = questions.findIndex((q) => q.id === id);
    if (index !== -1) {
      questions.splice(index, 1);
      return res(ctx.status(200));
    }
    return res(ctx.status(404));
  }),
  rest.patch('http://localhost:4000/questions/:id', (req, res, ctx) => {
    console.log('PATCH /questions/:id called:', req.params.id, req.body); // Debug log
    const id = parseInt(req.params.id);
    const question = questions.find((q) => q.id === id);
    if (question) {
      question.correctIndex = parseInt(req.body.correctIndex);
      return res(ctx.json(question));
    }
    return res(ctx.status(404));
  })
);