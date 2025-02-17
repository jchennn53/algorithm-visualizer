import React from 'react';
import './ArrayVisualizer/styles.css';

const StepDescription = ({ algorithm, currentStep, steps }) => {
    const getDescription = () => {
        if (!steps || !steps[currentStep]) return '';
        
        const step = steps[currentStep];
        const { comparedIndices, swapped, pivotIndex } = step;
        
        switch (algorithm) {
        case 'bubble-sort':
            if (comparedIndices?.length === 2) {
                const [i, j] = comparedIndices;
                return swapped 
                    ? `Swapping ${step.array[j]} and ${step.array[i]} since ${step.array[i]} is smaller`
                    : `Comparing ${step.array[i]} and ${step.array[j]}`;
            }
            break;
            
        case 'quick-sort':
            if (pivotIndex !== null) {
                const pivotValue = step.array[pivotIndex];
                if (comparedIndices?.length === 1) {
                    return `Selected ${pivotValue} as pivot`;
                }
                return swapped
                    ? `Moving ${step.array[comparedIndices[0]]} to the left of pivot ${pivotValue} since it's smaller`
                    : `Comparing ${step.array[comparedIndices[0]]} with pivot ${pivotValue}`;
            }
            break;
            
        case 'selection-sort':
            if (comparedIndices?.length === 2) {
                return swapped
                    ? `Found new minimum ${step.array[comparedIndices[1]]}, swapping with ${step.array[comparedIndices[0]]}`
                    : `Looking for minimum element - comparing ${step.array[comparedIndices[0]]} and ${step.array[comparedIndices[1]]}`;
            }
            break;
            
        case 'insertion-sort':
            if (comparedIndices?.length === 2) {
                return `Inserting ${step.array[comparedIndices[1]]} into its correct position`;
            }
            break;
            
        case 'merge-sort':
            if (comparedIndices?.length === 2) {
                return `Merging: comparing elements ${step.array[comparedIndices[0]]} and ${step.array[comparedIndices[1]]}`;
            } else if (comparedIndices?.length === 1) {
                return `Placing ${step.array[comparedIndices[0]]} in its sorted position`;
            }
            break;
            
        default:
            return '';
        }
    };

    return (
        <div className="step-description">
        <p>{getDescription() || 'Ready to start sorting...'}</p>
        </div>
    );
};

export default StepDescription;