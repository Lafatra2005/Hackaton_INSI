import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { quizAPI } from '../services/api';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!isFinished) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, isFinished]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getQuizById(id);
      setQuiz(response.data.quiz);
    } catch (error) {
      toast.error('Erreur lors du chargement du quiz');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await quizAPI.submitQuiz({
        quizId: parseInt(id),
        answers,
        timeSpent
      });
      
      setResult(response.data.result);
      setIsFinished(true);
      toast.success('Quiz terminé ! Voir vos résultats.');
    } catch (error) {
      toast.error('Erreur lors de la soumission du quiz');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Quiz non trouvé</p>
      </div>
    );
  }

  if (isFinished && result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Award className="h-16 w-16 text-success-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz terminé !
          </h1>
          <p className="text-gray-600">
            Vous avez complété le quiz "{quiz.title}"
          </p>
        </div>

        {/* Score Card */}
        <div className="card mb-8">
          <div className="card-body text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-success-600 mb-2">
                {result.score}%
              </div>
              <p className="text-lg text-gray-600">
                {result.correctAnswers} / {result.totalQuestions} questions correctes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {result.totalQuestions}
                </div>
                <p className="text-sm text-gray-600">Questions totales</p>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="text-2xl font-bold text-success-600 mb-1">
                  {result.correctAnswers}
                </div>
                <p className="text-sm text-gray-600">Réponses correctes</p>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {formatTime(result.timeSpent)}
                </div>
                <p className="text-sm text-gray-600">Temps passé</p>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-outline flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Refaire le quiz</span>
              </button>
              <Link to="/quizzes" className="btn btn-primary">
                Voir tous les quiz
              </Link>
            </div>
          </div>
        </div>

        {/* Answers Review */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Revue des réponses
            </h3>
            
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = result.answers[question.id];
                const isCorrect = userAnswer?.isCorrect;
                
                return (
                  <div key={question.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-success-100' : 'bg-danger-100'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-success-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-danger-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Question {index + 1}: {question.question_text}
                        </h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Votre réponse:</span>
                            <span className={`text-sm font-medium ${
                              isCorrect ? 'text-success-600' : 'text-danger-600'
                            }`}>
                              {userAnswer?.userAnswer || 'Non répondue'}
                            </span>
                          </div>
                          
                          {!isCorrect && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Réponse correcte:</span>
                              <span className="text-sm font-medium text-success-600">
                                {question.correct_answer}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Explication:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-success-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              {quiz.title}
            </h1>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timeSpent)}
            </div>
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} sur {quiz.questions.length}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-fill primary"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-6">
        <div className="card-body">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question_text}
          </h2>
          
          {question.media_url && (
            <div className="mb-6">
              <img
                src={question.media_url}
                alt="Question media"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  answers[question.id] === option
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswerSelect(question.id, option)}
                  className="sr-only"
                />
                <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center">
                  {answers[question.id] === option && (
                    <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn btn-outline flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Précédent</span>
        </button>
        
        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} / {quiz.questions.length}
        </div>
        
        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== quiz.questions.length}
            className="btn btn-success flex items-center space-x-2"
          >
            <Award className="h-4 w-4" />
            <span>Terminer</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn btn-primary flex items-center space-x-2"
          >
            <span>Suivant</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizDetail;