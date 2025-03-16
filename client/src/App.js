import React, { useState } from 'react';
import ArrayCanvas from './components/ArrayVisualizer/ArrayCanvas';
import ArrayControls from './components/ArrayVisualizer/ArrayControls';
import AlgorithmSelector from './components/AlgorithmSelector';
import StepDescription from './components/StepDescription';
import useArrayState from './components/ArrayVisualizer/useArrayState';
import useSorting from './components/ArrayVisualizer/useSorting';

import GraphCanvas from './components/GraphVisualizer/GraphCanvas';
import GraphControls from './components/GraphVisualizer/GraphControls';
import useGraphState from './components/GraphVisualizer/useGraphState';
import useGraphAlgorithm from './components/GraphVisualizer/useGraphAlgorithm';

const App = () => {
	const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
	const [algoType, setAlgoType] = useState(null); //can only be 'array' or 'graph'

	const { 
		array, 
		setArray, 
		addElement, 
		removeElement, 
		updateElement, 
		setRandomArray, 
		swapElements,
		resetArray
	} = useArrayState();

	const {
		isSorting: isSortingArray,
		currentStep: currentStepArray,
		steps: stepsArray,
		speed: speedArray,
		setSpeed: setSpeedArray,
		startSorting,
		resetSorting,
		goToStart: goToStartArray,
		goToEnd: goToEndArray,
		goPrev: goPrevArray,
		goNext: goNextArray,
		pauseSorting,
		isManualStep,
		isDragging,
		setIsDragging
	} = useSorting(array, setArray, selectedAlgorithm);

	const {
		graph,
		setGraph,
		initialGraph,
		resetGraph,
		setRandomGraph,
		addNode,
		addEdge
	} = useGraphState();

	const {
		isSorting: isSortingGraph,
		currentStep: currentStepGraph,
		steps: stepsGraph,
		speed: speedGraph,
		setSpeed: setSpeedGraph,
		startNode,
		setStartNode,
		startAlgorithm,
		pauseAlgorithm,
		resetAlgorithm,
		goToStart: goToStartGraph,
		goToEnd: goToEndGraph,
		goNext: goNextGraph,
		goPrev: goPrevGraph
	} = useGraphAlgorithm(graph, selectedAlgorithm);

	const algorithmSelect = (algorithm, type) => {
		setSelectedAlgorithm(algorithm);
		setAlgoType(type);

		if(type === 'array'){
			resetArray();
		} else if(type === 'graph'){
			resetAlgorithm();
		}
	};

	if(!selectedAlgorithm){
		return <AlgorithmSelector onSelect={algorithmSelect} />;
	}

	return (
    	<div className="container">
      		<h1 onClick={() => {setSelectedAlgorithm(null); setAlgoType(null);}} style={{ cursor: 'pointer' }}>Algorithm Visualizer</h1>
      
			<div className="algorithm-info">
				<h2>
				{selectedAlgorithm.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
				</h2>
				<p>{getAlgorithmDescription(selectedAlgorithm, algoType)}</p>
			</div>

			{algoType === 'array' ? (
				<>
					<ArrayCanvas
						array={array}
						removeElement={removeElement}
						updateElement={updateElement}
						steps={stepsArray}
						currentStep={currentStepArray}
						speed={speedArray}
						swapElements={swapElements}
						isManualStep={isManualStep}
						isSorting={isSortingArray}
						isDragging={isDragging}
						setIsDragging={setIsDragging}
					/>

					<StepDescription 
						algorithm={selectedAlgorithm}
						currentStep={currentStepArray}
						steps={stepsArray}
						isSorting={isSortingArray}
					/>

					<div className="progress-indicator">
						{stepsArray.length > 0 && (<p>Step {currentStepArray + 1} of {stepsArray.length}</p>)}
					</div>

					<ArrayControls
						addElement={addElement}
						array={array}
						setRandomArray={setRandomArray}
						isSorting={isSortingArray}
						startSorting={startSorting}
						resetSorting={resetSorting}
						speed={speedArray}
						setSpeed={setSpeedArray}
						steps={stepsArray}
						currentStep={currentStepArray}
						goPrev={goPrevArray}
						goNext={goNextArray}
						pauseSorting={pauseSorting}
						goToStart={goToStartArray}
						goToEnd={goToEndArray}
					/>

				</>
			) : (
				<>
					<GraphCanvas />

					<StepDescription
						algorithm = {selectedAlgorithm}
						currentStep = {currentStepGraph}
						steps = {stepsGraph}
						isSorting = {isSortingGraph}
					/>

					<div className="progress-indicator">
						{stepsGraph.length > 0 && (<p>Step {currentStepGraph + 1} of {stepsGraph.length}</p>)}
					</div>

					<GraphControls 
						setRandomGraph = {setRandomGraph}
						isSorting={isSortingGraph}
						goToStart={goToStartGraph}
						goPrev={goPrevGraph}
						goNext={goNextGraph}
						goToEnd={goToEndGraph}
						speed={speedGraph}
						setSpeed={setSpeedGraph}
						pauseAlgorithm={pauseAlgorithm}
						resetAlgorithm={resetAlgorithm}
						startAlgorithm={startAlgorithm}
						currentStep={currentStepGraph}
						steps={stepsGraph}
						graph = {graph}
						startNode = {startNode}
						setStartNode = {setStartNode}	
					/>
				</>
			)}

			<button 
				onClick={() => {setSelectedAlgorithm(null); setAlgoType(null);}}
				className="back-button"
			>
				Choose a different algorithm
			</button>
    	</div>
  	);
};

const getAlgorithmDescription = (algorithm, type) => {
	const descriptions = {
		array: {
			'bubble-sort': 'Repeatedly traverses the list, comparing and swapping adjacent elements that are out of order. In simple terms, if the first element is greater than the second element, they are swapped.',
			'quick-sort': 'Selects a "pivot" element, partitions the array around it, and recursively sorts the sub-arrays. In simple terms, if the element is less than the pivot, it is moved to the left side of the pivot, otherwise it is moved to the right side.',
			'selection-sort': 'Finds the minimum element from the unsorted portion and places it at the beginning repeatedly.',
			'insertion-sort': 'Builds the sorted array one item at a time by inserting elements into their correct position.',
			'merge-sort': 'Recursively divides the array into smaller subarrays, sorts them, and then merges the sorted subarrays.'
		},
		
		graph: {
			'bfs': 'Explores all neighbor nodes at the present depth before moving to nodes at the next depth level.',
			'dfs': 'Explores as far as possible along each branch before backtracking. In simple terms, it follows a path as deep as possible, then backtracks to explore other paths.',
			'dijkstra': 'Finds the shortest paths from a source node to all other nodes in a weighted graph. In simple terms, it greedily selects the unvisited node with the smallest distance and updates its neighbors.'
		}
	};
	return descriptions[type]?.[algorithm] || '';
};

export default App;