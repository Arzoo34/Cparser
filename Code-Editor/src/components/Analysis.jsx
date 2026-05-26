import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaClock, FaMemory, FaChartLine } from 'react-icons/fa';
import { generateComplexityData } from '../utils/codeAnalyzer';

const Analysis = ({ complexity, runtime, memory, memoryLimit }) => {
  const complexityData = generateComplexityData(complexity);

  // Find the detected complexity line
  const detectedComplexity = complexityData.find(c => c.name === complexity.complexity);
  const otherComplexities = complexityData.filter(c => c.name !== complexity.complexity);

  // Format runtime
  const formatRuntime = (ms) => {
    if (!ms || ms === 0) return 'N/A';
    if (ms < 1) return `${(ms * 1000).toFixed(2)} μs`;
    if (ms < 1000) return `${ms.toFixed(2)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  };

  // Format memory
  const formatMemory = (bytes) => {
    if (!bytes || bytes === 0) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Prepare data for chart (sample every 10 points for performance)
  const chartData = Array.from({ length: 101 }, (_, i) => {
    const dataPoint = { elements: i };
    complexityData.forEach(comp => {
      if (comp.data[i]) {
        dataPoint[comp.name] = Math.min(comp.data[i].y, 1000); // Cap at 1000
      }
    });
    return dataPoint;
  }).filter((_, i) => i % 2 === 0); // Sample every other point

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 shadow-2xl">
      <div className="flex items-center space-x-2 mb-6">
        <FaChartLine className="text-purple-400 text-xl" />
        <h2 className="text-2xl font-bold text-white">Code Analysis</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FaChartLine className="text-blue-400" />
            <span className="text-sm text-gray-400">Complexity</span>
          </div>
          <div className="text-2xl font-bold text-white">{complexity.complexity}</div>
          <div className="text-xs text-gray-500 mt-1">{complexity.description}</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FaClock className="text-green-400" />
            <span className="text-sm text-gray-400">Runtime</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {runtime ? formatRuntime(runtime) : 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Execution time</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FaMemory className="text-purple-400" />
            <span className="text-sm text-gray-400">Memory</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {memory ? formatMemory(memory) : 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {memoryLimit ? `Limit: ${formatMemory(memoryLimit)}` : 'Memory usage'}
          </div>
        </div>
      </div>

      {/* Complexity Graph */}
      <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Big-O Complexity Chart</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="elements"
                stroke="#9CA3AF"
                label={{ value: 'Elements', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
              />
              <YAxis
                stroke="#9CA3AF"
                domain={[0, 1000]}
                label={{ value: 'Operations', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />

              {/* Show detected complexity with thicker line */}
              {detectedComplexity && (
                <Line
                  type="monotone"
                  dataKey={detectedComplexity.name}
                  stroke={detectedComplexity.color}
                  strokeWidth={4}
                  dot={false}
                  name={`${detectedComplexity.name} (Your Code)`}
                />
              )}

              {/* Show other complexities with thinner lines */}
              {otherComplexities.map((comp) => (
                <Line
                  key={comp.name}
                  type="monotone"
                  dataKey={comp.name}
                  stroke={comp.color}
                  strokeWidth={1.5}
                  dot={false}
                  strokeOpacity={0.6}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          The highlighted line shows your code's estimated complexity. Lower complexity is better for scalability.
        </p>
      </div>
    </div>
  );
};

export default Analysis;

