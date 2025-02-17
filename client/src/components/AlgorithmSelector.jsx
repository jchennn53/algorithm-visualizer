//import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
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
        <h2>Choose an algorithm</h2>
        <div className="algorithm-grid">
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