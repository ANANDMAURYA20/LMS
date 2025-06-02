import React from 'react';

const ScoreInput = ({ score, onScoreChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Student Score (0-100):
      </label>
      <input
        type="number"
        min="0"
        max="100"
        value={score}
        onChange={(e) => onScoreChange(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};

export default ScoreInput;