import './AlgorithmSelector.css';

const algorithms = [
    { name: 'Bubble Sort', value: 'bubble-sort' },
    { name: 'Quick Sort', value: 'quick-sort' },
    { name: 'Selection Sort', value: 'selection-sort' },
    { name: 'Insertion Sort', value: 'insertion-sort' },
    { name: 'Merge Sort', value: 'merge-sort' }
];

const AlgorithmSelector = ({ onSelect }) => {
    return (
        <div className="algorithm-selector">
            <h1>Algorithm Visualizer</h1>
            <h2>Choose an algorithm</h2>
            <div className="algorithm-grid">
                {/*map through algorithms and create a button for each*/}
                {algorithms.map((algo) => (
                    <button 
                        key={algo.value}
                        onClick={() => onSelect(algo.value)}
                        className="algorithm-card"
                    >
                        {algo.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AlgorithmSelector;