import React, { useState } from 'react';
import axios from 'axios';
import PDFUploader from './PDFUploader';
import ScoreInput from './ScoreInput';

const QuestionGenerator = () => {
  const [pdfContent, setPDFContent] = useState('');
  const [score, setScore] = useState('');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateQuestions = async () => {
    if (!pdfContent || !score || !subject) {
      setError('Please provide all required information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}api/generate-questions`,
        {
          pdfContent,
          score: parseInt(score),
          subject
        }
      );
      setQuestions(response.data.questions.split('\n').filter(q => q.trim()));
    } catch (err) {
      setError('Error generating questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Question Generator</h1>
      
      <PDFUploader onPDFContent={setPDFContent} />
      
      <ScoreInput score={score} onScoreChange={setScore} />
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Subject:
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter subject"
        />
      </div>

      <button
        onClick={handleGenerateQuestions}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {loading ? 'Generating...' : 'Generate Questions'}
      </button>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}

      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">Generated Questions:</h2>
          <ul className="list-decimal pl-5">
            {questions.map((question, index) => (
              <li key={index} className="mb-2">{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;