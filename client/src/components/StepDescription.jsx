import React from 'react';
import './ArrayVisualizer/styles.css';

const StepDescription = ({ algorithm, currentStep, steps }) => {
    const getDescription = () => {
        if(!steps || !steps[currentStep]) return '';
        
        const step = steps[currentStep];
        const { comparedIndices, swapped, pivotIndex, partitionIndex } = step;
        
        switch(algorithm){
        case 'bubble-sort':
            if(comparedIndices?.length === 2){
                const [i, j] = comparedIndices;
                return swapped 
                    ? `Swapping ${step.array[j]} and ${step.array[i]} since ${step.array[i]} is smaller`
                    : `Comparing ${step.array[i]} and ${step.array[j]}`;
            }
            break;
            
        case 'quick-sort':
            if(pivotIndex !== null){

                const pivotValue = step.array[pivotIndex];
                //pivot selection
                if(comparedIndices?.length === 1){
                    if(comparedIndices[0] === pivotIndex) {
                        return `Selected ${pivotValue} as the pivot element.`;
                    }
                    
                    //pivot comparison
                    const comparedElement = step.array[comparedIndices[0]];
                    return comparedElement < pivotValue
                        ? `Element ${comparedElement} is less than pivot ${pivotValue}, moving it to the left side.`
                        : `Element ${comparedElement} is greater than pivot ${pivotValue}, leaving it in place.`;
                }
                
                //pivot swap
                if(step.isPivotSwap){
                    const swapWith = step.array[step.pivotIndex];
                    const pivotValue = step.array[step.partitionIndex];
                    return `Swapping pivot ${pivotValue} with element ${swapWith} at position ${step.partitionIndex} to place pivot in its correct position.`;
                }

                //elements swap
                if(comparedIndices?.length === 2 && swapped) {
                    const [i, j] = comparedIndices;
                    return `Swapping ${step.array[j]} and ${step.array[i]} since ${step.array[i]} is smaller`;
                }
            }
            break;
            
        case 'selection-sort':
            if(comparedIndices?.length === 2){
                return swapped
                    ? `Found minimum ${step.array[comparedIndices[0]]}, swapping with ${step.array[comparedIndices[1]]}`
                    : `Looking for minimum element - comparing ${step.array[comparedIndices[0]]} and ${step.array[comparedIndices[1]]}`;
            }
            break;
            
        case 'insertion-sort':
            if(comparedIndices?.length === 2){
                return `Inserting ${step.array[comparedIndices[1]]} into its correct position`;
            }
            break;
            
        case 'merge-sort':
            if(comparedIndices?.length === 2){
                return `Merging: comparing elements ${step.array[comparedIndices[0]]} and ${step.array[comparedIndices[1]]}`;
            } else if(comparedIndices?.length === 1){
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