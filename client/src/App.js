import { useEffect } from 'react';
import TestVisualization from './components/Algorithms/TestVisualization';

function App() {
  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>Algorithm Visualizer</h1>
      <TestVisualization />
    </div>
  );
}
export default App;