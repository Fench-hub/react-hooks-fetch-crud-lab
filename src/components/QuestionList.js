// src/components/QuestionList.js
import React from 'react';

function QuestionList({ questions, onDelete, onUpdate }) {
  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <strong>{question.prompt}</strong>
            <ul>
              {question.answers.map((answer, index) => (
                <li key={index}>{answer}</li>
              ))}
            </ul>
            <label>
              Correct Answer
              <select
                aria-label="Correct Answer"
                value={String(question.correctIndex)}
                onChange={(e) => onUpdate(question.id, e.target.value)}
              >
                {question.answers.map((answer, index) => (
                  <option key={index} value={index}>
                    {answer}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => onDelete(question.id)}>Delete Question</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
