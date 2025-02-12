import useArrayState from './components/ArrayVisualizer/useArrayState';
import ArrayControls from './components/ArrayVisualizer/ArrayControls';
import ArrayCanvas from './components/ArrayVisualizer/ArrayCanvas';
import useSorting from './components/ArrayVisualizer/useSorting';

function App() {
    const arrayState = useArrayState();
    const sortingState = useSorting(arrayState.array, arrayState.setArray);

    return (
      <div className = "App">
        <h1>Algorithm Visualizer</h1>
        <ArrayControls {...arrayState} {...sortingState} resetSorting = {sortingState.resetSorting}/>
        <ArrayCanvas array = {arrayState.array} 
                    removeElement = {arrayState.removeElement} 
					          updateElement={arrayState.updateElement} 
                    swapElements={sortingState.isSorting ? () => {} : arrayState.swapElements}
					          steps = {sortingState.steps}
					          currentStep = {sortingState.currentStep}
					          speed = {sortingState.speed}
                    isManualStep = {sortingState.isManualStep}
                    isSorting = {sortingState.isSorting}
		    />
      </div>
    )
}
export default App;