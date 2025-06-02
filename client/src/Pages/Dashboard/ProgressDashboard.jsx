import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../../Layout/Layout';
import { getProgressAnalysis } from '../../Redux/Slices/ProgressSlice';
import { getUserScores } from '../../Redux/Slices/ScoreSlice';

function ProgressDashboard() {
  const dispatch = useDispatch();
  const { analysis, loading } = useSelector((state) => state.progress);
  const { userScores } = useSelector((state) => state.scores);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    dispatch(getProgressAnalysis());
    dispatch(getUserScores());
  }, [dispatch]);

  useEffect(() => {
    if (userScores?.length > 0) {
      // Process scores for chart display - last 10 attempts
      const processedData = userScores
        .slice(0, 10)
        .map(score => ({
          courseName: score.courseId.title,
          score: score.score,
          date: new Date(score.attemptedAt).toLocaleDateString()
        }))
        .reverse();
      
      setChartData(processedData);
    }
  }, [userScores]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-8 text-center"
          >
            Your Learning Progress
          </motion.h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI Analysis Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
              >
                <div className="flex items-center mb-4">
                  <FaBrain className="text-3xl text-blue-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">AI Analysis</h2>
                </div>
                
                {analysis ? (
                  <div className="space-y-6 text-gray-200">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-300 mb-2">Summary</h3>
                      <p>{analysis.summary}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-green-300 mb-2 flex items-center">
                          <FaLightbulb className="mr-2" /> Strengths
                        </h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.strengths?.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-300 mb-2 flex items-center">
                          <FaExclamationTriangle className="mr-2" /> Areas to Improve
                        </h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.weaknesses?.map((weakness, idx) => (
                            <li key={idx}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-purple-300 mb-2">Recommendations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.recommendations?.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-lg font-semibold mr-2">Progress Trend:</span>
                      <span className={`font-bold ${
                        analysis.progressTrend === 'improving' ? 'text-green-400' :
                        analysis.progressTrend === 'declining' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {analysis.progressTrend?.charAt(0).toUpperCase() + analysis.progressTrend?.slice(1)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300">No analysis available yet. Complete more quizzes to get personalized insights.</p>
                )}
              </motion.div>
              
              {/* Recent Scores Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
              >
                <div className="flex items-center mb-4">
                  <FaChartLine className="text-3xl text-green-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Recent Scores</h2>
                </div>
                
                {chartData.length > 0 ? (
                  <div className="space-y-4">
                    {chartData.map((item, idx) => (
                      <div key={idx} className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                              {item.courseName.length > 20 ? item.courseName.substring(0, 20) + '...' : item.courseName}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {item.score.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                          <div 
                            style={{ width: `${item.score}%` }} 
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              item.score >= 70 ? 'bg-green-500' : 
                              item.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 text-right">{item.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300">No recent quiz attempts found.</p>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ProgressDashboard;