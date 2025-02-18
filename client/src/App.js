import React, { useState } from 'react';
import ArrayCanvas from './components/ArrayVisualizer/ArrayCanvas';
import ArrayControls from './components/ArrayVisualizer/ArrayControls';
import AlgorithmSelector from './components/AlgorithmSelector';
import StepDescription from './components/StepDescription';
import useArrayState from './components/ArrayVisualizer/useArrayState';
import useSorting from './components/ArrayVisualizer/useSorting';

const App = () => {
	const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
	const { 
		array, 
		setArray, 
		addElement, 
		removeElement, 
		updateElement, 
		setRandomArray, 
		swapElements 
	} = useArrayState();

	const {
		isSorting,
		currentStep,
		steps,
		speed,
		setSpeed,
		startSorting,
		resetSorting,
		goToStart,
		goToEnd,
		goPrev,
		goNext,
		pauseSorting,
		isManualStep,
		isDragging,
		setIsDragging
	} = useSorting(array, setArray, selectedAlgorithm);

	if(!selectedAlgorithm){
		return <AlgorithmSelector onSelect={setSelectedAlgorithm} />;
	}

	return (
    	<div className="container">
      		<h1 onClick={() => setSelectedAlgorithm(null)} style={{ cursor: 'pointer' }}>Algorithm Visualizer</h1>
      
			<div className="algorithm-info">
				<h2>
				{selectedAlgorithm.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
				</h2>
				<p>{getAlgorithmDescription(selectedAlgorithm)}</p>
			</div>

			<ArrayCanvas
				array={array}
				removeElement={removeElement}
				updateElement={updateElement}
				steps={steps}
				currentStep={currentStep}
				speed={speed}
				swapElements={swapElements}
				isManualStep={isManualStep}
				isSorting={isSorting}
				isDragging={isDragging}
				setIsDragging={setIsDragging}
			/>

			<StepDescription 
				algorithm={selectedAlgorithm}
				currentStep={currentStep}
				steps={steps}
				isSorting={isSorting}
			/>

			<div className="progress-indicator">
				{steps.length > 0 && (<p>Step {currentStep + 1} of {steps.length}</p>)}
			</div>

			<ArrayControls
				addElement={addElement}
				array={array}
				setRandomArray={setRandomArray}
				isSorting={isSorting}
				startSorting={startSorting}
				resetSorting={resetSorting}
				speed={speed}
				setSpeed={setSpeed}
				steps={steps}
				currentStep={currentStep}
				goPrev={goPrev}
				goNext={goNext}
				pauseSorting={pauseSorting}
				goToStart={goToStart}
				goToEnd={goToEnd}
			/>

			<button 
				onClick={() => setSelectedAlgorithm(null)}
				className="back-button"
			>
				Choose a different algorithm
			</button>
    	</div>
  	);
};

const getAlgorithmDescription = (algorithm) => {
	const descriptions = {
		'bubble-sort': 'Repeatedly traverses the list, comparing and swapping adjacent elements that are out of order. In simple terms, if the first element is greater than the second element, they are swapped.',
		'quick-sort': 'Selects a "pivot" element, partitions the array around it, and recursively sorts the sub-arrays. In simple terms, if the element is less than the pivot, it is moved to the left side of the pivot, otherwise it is moved to the right side.',
	    'selection-sort': 'Finds the minimum element from the unsorted portion and places it at the beginning repeatedly.',
	    'insertion-sort': 'Builds the sorted array one item at a time by inserting elements into their correct position.',
	    'merge-sort': 'Recursively divides the array into smaller subarrays, sorts them, and then merges the sorted subarrays.'
	};
	return descriptions[algorithm] || '';
};

export default App;