import { useState, useEffect, useCallback } from 'react';

const useGraphAlgorithm = (graph, selectedAlgorithm) => {
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSorting, setIsSorting] = useState(false);
    const [speed, setSpeed] = useState(1000);
    const [startNode, setStartNode] = useState('0');

    const fetchAlgorithmSteps = useCallback(async (baseGraph) => {
        try{
            const response = await fetch(`http://localhost:5000/${selectedAlgorithm}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    graph: baseGraph,
                    startNode 
                }) 
            });
            const data = await response.json();
            return data.steps;
        } catch(error){
            console.error('Error fetching graph algorithm:', error);
            return [];
        }
    }, [selectedAlgorithm, startNode]);

    const startAlgorithm = async () => {
        if(steps.length === 0){
            const generatedSteps = await fetchAlgorithmSteps(graph);
            setSteps(generatedSteps);
            setCurrentStep(0);
        }

        setIsSorting(true);
    };

    const resetAlgorithm = () => {
        setIsSorting(false);
        setCurrentStep(0);
        setSteps([]);
    };

    const goToStart = async () => { 
        setIsSorting(false);

        if(steps.length === 0){
            const generatedSteps = await fetchAlgorithmSteps(graph);
            setSteps(generatedSteps);
        }

        setCurrentStep(0);
    };

    const goToEnd = async () => {
        if(steps.length === 0){
            const generatedSteps = await fetchAlgorithmSteps(graph);
            setSteps(generatedSteps);
        }

        setIsSorting(false);
        setCurrentStep(Math.max(0, steps.length - 1));
    };

    const goPrev = () => {
        if(currentStep > 0){
            setIsSorting(false);
            setCurrentStep(prev => prev - 1);
        }
    };

    const goNext = async () => {
        if(steps.length === 0){
            const generatedSteps = await fetchAlgorithmSteps(graph);
            setSteps(generatedSteps);
        }

        if(currentStep < steps.length - 1){
            setIsSorting(false);
            setCurrentStep(prev => prev + 1);
        }
    };

    const pauseAlgorithm = () => {
        setIsSorting(false);
    };

    useEffect(() => {
        if(isSorting && currentStep < steps.length - 1){
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timer);
        } else if(currentStep >= steps.length - 1){
            setIsSorting(false);
        }
    }, [isSorting, currentStep, steps, speed]);

    useEffect(() => {
        resetSorting();
    }, [selectedAlgorithm, startNode]);

    return {
        isSorting,
        currentStep,
        steps,
        speed,
        setSpeed,
        startNode,
        setStartNode,
        startAlgorithm,
        pauseAlgorithm,
        resetAlgorithm,
        goToStart,
        goToEnd,
        goNext,
        goPrev
    };
};

export default useGraphAlgorithm;