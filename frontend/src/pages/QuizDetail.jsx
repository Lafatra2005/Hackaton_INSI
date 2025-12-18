import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    quizAPI.getQuizById(id)
      .then(res => {
          if (res.data.quiz) setQuiz(res.data.quiz);
          setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    try {
      const res = await quizAPI.submitQuiz({ quizId: id, answers, timeSpent: 0 });
      setResult(res.data.result);
    } catch (e) { alert("Erreur lors de l'envoi"); }
  };

  if (loading) return <div className="text-center py-20">Chargement des questions...</div>;
  if (!quiz || !quiz.questions) return <div className="text-center py-20">Quiz introuvable.</div>;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Score : {result.score}%</h1>
        <button onClick={() => window.location.href='/quizzes'} className="bg-blue-600 text-white px-6 py-2 rounded">Retour</button>
      </div>
    );
  }

  const q = quiz.questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">{q?.question_text}</h2>
      <div className="space-y-4">
        {q?.options?.map((opt, i) => (
          <button key={i} onClick={() => setAnswers({...answers, [q.id]: opt})}
            className={`w-full text-left p-4 border rounded ${answers[q.id] === opt ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(c => c - 1)} className="p-2 border rounded">Précédent</button>
        {currentQuestion === quiz.questions.length - 1 ? 
           <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded">Terminer</button> :
           <button onClick={() => setCurrentQuestion(c => c + 1)} className="bg-blue-600 text-white px-6 py-2 rounded">Suivant</button>
        }
      </div>
    </div>
  );
};
export default QuizDetail;