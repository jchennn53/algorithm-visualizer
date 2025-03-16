import './AlgorithmSelector.css';

const algorithms = [
    {
        type: 'array',
        title: 'Array algorithms',
        options: [
            { name: 'Bubble Sort', value: 'bubble-sort' },
            { name: 'Quick Sort', value: 'quick-sort' },
            { name: 'Selection Sort', value: 'selection-sort' },
            { name: 'Insertion Sort', value: 'insertion-sort' },
            { name: 'Merge Sort', value: 'merge-sort' }
        ]
    },

    {
        type: 'graph',
        title: 'Graph algorithms',
        options: [
            { name: 'Breadth First Search', value: 'bfs' },
            { name: 'Depth First Search', value: 'dfs' },
            { name: 'Dijkstra', value: 'dijkstra' }
        ]
    }
];

const AlgorithmSelector = ({ onSelect }) => {
    return (
        <div className = "algorithm-selector">
            <h1>Algorithm Visualizer</h1>
            <h2>Choose an algorithm</h2>

            {algorithms.map((category) => (
                <div key = {category.type} className = "algorithm-category">
                    <h3>{category.title}</h3>
                    <div className = "algorithm-grid">
                        {/*map through algorithms and create a button for each*/}
                        {category.options.map((algo) => (
                            <button 
                                key = {algo.value}
                                onClick = {() => onSelect(algo.value, category.type)}
                                className = "algorithm-card"
                            >
                                {algo.name}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlgorithmSelector;