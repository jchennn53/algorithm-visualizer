import React from 'react';
import './styles.css';

const StepDescription = ({ algorithm, currentStep, steps, isSorting }) => {
    const getDescription = () => {
        if(!steps || !steps[currentStep]) return '';
        
        const step = steps[currentStep];
        const { comparedIndices, swapped, 
                pivotIndex, partitionIndex,
                selectedElement, isInitialSelection, isFinalPlacement }
        = step;
        
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
                    const smaller = steps[currentStep - 1].array[j];
                    const larger = steps[currentStep - 1].array[i];
                    return `Swapping ${smaller} and ${larger} since ${smaller} is smaller`;
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
            if(step.selectedElement !== undefined){
                const selectedValue = step.array[step.selectedElement];
                
                if(step.isInitialSelection){
                    return `Selected ${selectedValue} to insert into sorted portion`;
                }
                
                if(comparedIndices?.length === 2){
                    return swapped 
                        ? `Moving ${step.array[comparedIndices[1]]} right to make space for ${selectedValue}`
                        : `Comparing ${selectedValue} with ${step.array[comparedIndices[0]]}`;
                }
                
                if(step.isFinalPlacement){
                    return step.swapped 
                        ? `Placed ${selectedValue} in its sorted position`
                        : `${selectedValue} is in its correct position`;
                }
            }
            break;
            
        case 'merge-sort':
            if(step.dividing){
                const { left, right } = step.mergeIndices;
                return `Dividing subarray from position ${left} to ${right}`;
            }
            
            if(comparedIndices?.length === 2){
                const [i, j] = comparedIndices;
                const firstElement = step.array[i];
                const secondElement = step.array[j];
                
                if(step.description === 'compare'){
                    return `Comparing ${firstElement} with ${secondElement}`;
                }
                
                if(step.description === 'swap-needed'){
                    return `${firstElement} is greater than ${secondElement}, preparing to swap`;
                }
                
                if(step.description === 'swapped'){
                    return `Swapping ${firstElement} to position ${i}`;
                }
            }
            break;


        default:
            return '';
        }
    };

    const isSortingEnded = !isSorting && steps && steps.length > 0 && currentStep >= steps.length - 1;
    return (
        <div className="step-description">
            <p>{isSortingEnded ? 'Algorithm complete!' : getDescription() || 'Ready to start the algorithm...'}</p>
        </div>
    );
};

export default StepDescription;