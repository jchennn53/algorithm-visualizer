import { useState } from 'react';

const ArrayControls = ({
    addElement,
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
    pauseSorting
}) => {
    const [element, setElement] = useState('');

    const handleAdd = () => {
        if (element.trim() !== '') {
            addElement(element);
            setElement('');
        }
    };

    return (
        <div className = "controls">
            <input type = "number" value = {element} onChange = {(e) => setElement(e.target.value)} 
                    placeholder = "Enter number" disabled = {isSorting} />

            <button onClick = {handleAdd}
                    disabled = {isSorting || element.trim() === ''}>
            Add
            </button>

            <button onClick = {() => {
                    setRandomArray();
                    resetSorting();}} 
                    disabled = {isSorting}>
            Random array
            </button>

            <div className = "sort-controls">
                <button onClick = {goPrev} disabled = {isSorting || currentStep <= 0 || steps.length === 0}
                        className = {currentStep <= 0 ? 'disabled' : ''}>
                    Previous step
                </button>

                <button onClick = {isSorting ? pauseSorting : startSorting}
                        className = {isSorting ? 'stop' : 'start'}>
                    {isSorting ? 'Pause' : 'Start'}
                </button>

                <button onClick = {goNext} disabled = {isSorting || currentStep === steps.length - 1} 
                        className = {currentStep === steps.length - 1 ? 'disabled' : ''}>
                    Next step
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