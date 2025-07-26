import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");

  const [questions, setQuestions] = useState([]);
    useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then(setQuestions)
      .catch(error => console.error("Error fetching questions:", error));
  }, []);
     const handleAddQuestion = (newQuestion) => {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: newQuestion.prompt,
        answers: [
          newQuestion.answer1,
          newQuestion.answer2,
          newQuestion.answer3,
          newQuestion.answer4
        ],
        correctIndex: parseInt(newQuestion.correctIndex)
      })
    })
      .then((res) => res.json())
      .then((data) => setQuestions([...questions, data]));
  };
     const handleDeleteQuestion = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setQuestions(questions.filter(q => q.id !== id));
      });
  };
    const handleUpdateQuestion = (id, correctIndex) => {
  fetch(`http://localhost:4000/questions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correctIndex: Number(correctIndex) })
  })
    .then((res) => res.json())
    .then((updatedQuestion) => {
      setQuestions(questions.map(q => 
        q.id === id ? updatedQuestion : q
      ));
    });
};

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm key="form" onAddQuestion={handleAddQuestion} />
      ) : (
      <QuestionList
          questions={questions}
          onDelete={handleDeleteQuestion}
          onUpdate={handleUpdateQuestion}
       />
      )}
    </main>
  );
}

export default App;