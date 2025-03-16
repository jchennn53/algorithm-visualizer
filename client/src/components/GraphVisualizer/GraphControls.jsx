import React from 'react';

const GraphControls = ({
    setRandomGraph,
    isSorting,
    goToStart,
    goPrev,
    goNext,
    goToEnd,
    speed,
    setSpeed,
    pauseAlgorithm,
    resetAlgorithm,
    startAlgorithm,
    currentStep,
    steps,
    graph,
    startNode,
    setStartNode
}) => {

    return (
        <div className = 'controls'>
            
            <div className = 'input-group'>
                <select value = {startNode} onChange = {(e) => setStartNode(e.target.value)} disabled = {isSorting}>
                    {Object.keys(graph).map(node => (
                        <option key = {node} value = {node}>
                            Start: Node {node}
                        </option>
                    ))} 
                </select>

                <button onClick = {() => {
                        setRandomGraph();
                        resetAlgorithm();}}
                        disabled = {isSorting}>
                    Random graph
                </button>
            </div>

            <div className = 'algo-controls'>
                <button onClick = {goToStart} disabled = {isSorting || currentStep <= 0 || steps.length === 0}>
                    Start state
                </button>

                <button onClick = {goPrev} disabled = {isSorting || currentStep <= 0 || steps.length === 0}>
                    Previous step
                </button>

                <button onClick = {isSorting ? pauseAlgorithm : startAlgorithm} 
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
                    <input type = "range" min = "100" max = "1000" value = {speed}
                            onChange = {(e) => setSpeed(Number(e.target.value))} />
                        ({speed}ms)
                </label>
            </div>
           
        </div>
    );
};

export default GraphControls;