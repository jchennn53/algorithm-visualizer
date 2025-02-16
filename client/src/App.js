import { useState } from 'react';
import useArrayState from './components/ArrayVisualizer/useArrayState';
import ArrayControls from './components/ArrayVisualizer/ArrayControls';
import ArrayCanvas from './components/ArrayVisualizer/ArrayCanvas';
import useSorting from './components/ArrayVisualizer/useSorting';
import AlgorithmSelector from './components/AlgorithmSelector';

function App() {
	const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
	const arrayState = useArrayState();
	const sortingState = useSorting(arrayState.array, arrayState.setArray, selectedAlgorithm);

	const handleAlgorithmSelect = (algorithm) => {
		arrayState.resetArray();
		sortingState.resetSorting();
		setSelectedAlgorithm(algorithm);
	}

	if (!selectedAlgorithm) {
		return (
		<div className="App">
			<h1>Algorithm Visualizer</h1>
			<AlgorithmSelector onSelect={handleAlgorithmSelect} />
		</div>
		);
	}

	return (
		<div className="App">
		<div className="header-bar">
			<button 
			onClick={() => setSelectedAlgorithm(null)}
			className="back-button"
			>
			← Choose Another Algorithm
			</button>
			<h2>{selectedAlgorithm}</h2>
		</div>
		
		<ArrayControls {...arrayState} {...sortingState} />
		<ArrayCanvas 
			array={arrayState.array} 
			removeElement={arrayState.removeElement} 
			updateElement={arrayState.updateElement} 
			swapElements={sortingState.isSorting ? () => {} : arrayState.swapElements}
			steps={sortingState.steps}
			currentStep={sortingState.currentStep}
			speed={sortingState.speed}
			isManualStep={sortingState.isManualStep}
			isSorting={sortingState.isSorting}
		/>
		</div>
	);
}

export default App;