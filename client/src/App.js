import React, { useState } from 'react';
import ArrayCanvas from './components/ArrayVisualizer/ArrayCanvas';
import ArrayControls from './components/ArrayVisualizer/ArrayControls';
import AlgorithmSelector from './components/AlgorithmSelector';
import StepDescription from './components/StepDescription';
import useArrayState from './components/ArrayVisualizer/useArrayState';
import useSorting from './components/ArrayVisualizer/useSorting';

const SortingVisualization = () => {
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

  if (!selectedAlgorithm) {
    return <AlgorithmSelector onSelect={setSelectedAlgorithm} />;
  }

  return (
    <div className="container">
      <h1>Sorting Visualizer</h1>
      
      <div className="algorithm-info">
        <h2>
          {selectedAlgorithm.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
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
    'bubble-sort': 'Repeatedly traverses the list, comparing and swapping adjacent elements that are out of order.',
    'quick-sort': 'Picks a "pivot" element and partitions the array around it, recursively sorting the sub-arrays.',
    'selection-sort': 'Repeatedly finds the minimum element from the unsorted portion and places it at the beginning.',
    'insertion-sort': 'Builds the final sorted array one item at a time, by repeatedly inserting a new element into the sorted portion.',
    'merge-sort': 'Divides the array into smaller subarrays, sorts them, and then merges them back together.'
  };
  return descriptions[algorithm] || '';
};

export default SortingVisualization;