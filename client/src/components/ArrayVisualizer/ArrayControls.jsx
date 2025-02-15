import { useState } from 'react';
//import { Plus, Shuffle, SkipBack, SkipForward, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const ArrayControls = ({
    addElement,
    array,
    setRandomArray,
    isSorting,
    startSorting,
    resetSorting,
    speed,
    setSpeed, 
    steps,
    currentStep,
    goPrev,
    goNext,
    pauseSorting,
    goToStart,
    goToEnd
}) => {
    const [element, setElement] = useState('');

    const handleAdd = () => {
        if (element.trim() !== '') {
            const wasAdded = addElement(element);
            if (wasAdded) {
                resetSorting(); //ensure sorting is reset when a new element is added
                setElement('');
            }
        }
    };

    return (
        <div className = "controls">

            <div className = "input-group">
                <input type = "number" value = {element} onChange = {(e) => setElement(e.target.value)} 
                        placeholder = "Enter number" disabled = {isSorting} />

                <button onClick = {handleAdd}
                        disabled = {isSorting || element.trim() === '' || array.length >= 15}>
                    Add
                </button>

                <button onClick = {() => {
                        setRandomArray();
                        resetSorting();}} 
                        disabled = {isSorting}>
                    Random array
                </button>
            </div>

            <div className = "sort-controls">
                <button onClick = {goToStart} disabled = {isSorting || currentStep <= 0 || steps.length === 0}>
                    Start state
                </button>

                <button onClick = {goPrev} disabled = {isSorting || currentStep <= 0 || steps.length === 0}
                        className = {currentStep <= 0 ? 'disabled' : ''}>
                    Previous step
                </button>

                <button onClick = {isSorting ? pauseSorting : startSorting}
                        className = {isSorting ? 'stop' : 'start'}
                        disabled = {!isSorting && steps.length > 0 && currentStep === steps.length - 1}>
                    {isSorting ? 'Pause' : 'Start'}
                </button>

                <button onClick = {goNext} disabled = {isSorting || (steps.length > 0 && currentStep === steps.length - 1)} 
                        className = {currentStep === steps.length - 1 ? 'disabled' : ''}>
                    Next step 
                </button>

                <button onClick = {goToEnd} disabled = {isSorting || (steps.length > 0 && currentStep === steps.length - 1)}>
                    End state 
                </button>

                <label>
                    Speed:
                    <input type = "range" min = "100" max = "2000" value = {speed}
                            onChange = {(e) => setSpeed(Number(e.target.value))} />
                    ({speed}ms)
                </label>

            </div>
        </div>
    );
};

export default ArrayControls;