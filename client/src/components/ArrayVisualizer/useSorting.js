import { useState, useEffect, useCallback } from 'react';

const useSorting = (array, setArray, selectedAlgorithm) => {
    const [isSorting, setIsSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); 
    const [steps, setSteps] = useState([]);
    const [speed, setSpeed] = useState(1000);
    const [isDragging, setIsDragging] = useState(false);
    const [isManualStep, setIsManualStep] = useState(false);

    const fetchSortingSteps = useCallback(async (baseArray) => {
        if(isDragging) return;
    
        try {
        const response = await fetch(`http://localhost:5000/${selectedAlgorithm}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ array: baseArray })
        });
        const data = await response.json();
        return [{ array: [...baseArray], isInitial: true, pivotIndex: null }, ...data.steps];
        } catch(error) {
            console.error(error);
            return [];
        }
    }, [isDragging, selectedAlgorithm]);

    const startSorting = async () => {
        if(isDragging) return;

        //only fetch new steps if we don't have any
        if (steps.length === 0) {
            const generatedSteps = await fetchSortingSteps(array);
            setSteps(generatedSteps);
            setCurrentStep(0);
        }
        
        setIsSorting(true);
    };

    const resetSorting = () => {
        setIsSorting(false);
        setCurrentStep(0);
        setSteps([]);
    };

    const goToStart = async () => {
        setIsSorting(false);
        
        if (steps.length > 0) {
            setIsManualStep(true);
            setCurrentStep(0);
            setArray([...steps[0].array]);
            setTimeout(() => setIsManualStep(false), speed);
            return;
        }

        const generatedSteps = await fetchSortingSteps(array);
        setSteps(generatedSteps);
        setIsManualStep(true);
        setCurrentStep(0);
        setArray([...generatedSteps[0].array]);
        setTimeout(() => setIsManualStep(false), speed);
    };

    const goToEnd = async () => {
        let workingSteps = steps;
        
        if (workingSteps.length === 0) {
            workingSteps = await fetchSortingSteps(array);
            setSteps(workingSteps);
        }

        if (workingSteps.length > 0) {
            const lastStep = workingSteps.length - 1;
            setIsManualStep(true);
            setCurrentStep(lastStep);
            setArray([...workingSteps[lastStep].array]);
            setTimeout(() => setIsManualStep(false), speed);
        }
        setIsSorting(false);
    };

    const goPrev = async () => {
        if (steps.length === 0) {
            const generatedSteps = await fetchSortingSteps(array);
            setSteps(generatedSteps);
        }

        if (steps.length === 0) return;

        const newStep = Math.max(0, currentStep - 1);
        if (newStep !== currentStep) {
            setIsManualStep(true);
            setCurrentStep(newStep);
            setArray([...steps[newStep].array]);
            setTimeout(() => setIsManualStep(false), speed);
        }
        setIsSorting(false);
    };

    const goNext = async () => {
        let workingSteps = steps;
        
        if (workingSteps.length === 0) {
            workingSteps = await fetchSortingSteps(array);
            setSteps(workingSteps);
        }

        if (workingSteps.length > 0 && currentStep < workingSteps.length - 1) {
            const newStep = currentStep + 1;
            setIsManualStep(true);
            setCurrentStep(newStep);
            setArray([...workingSteps[newStep].array]);
            setTimeout(() => setIsManualStep(false), speed);
        }
        setIsSorting(false);
    };

    const pauseSorting = () => {
        setIsSorting(false);
    };

    useEffect(() => {
        if (isSorting && currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);   
            }, speed);
            return () => clearTimeout(timer);
        } else if (currentStep >= steps.length - 1) {
            setIsSorting(false);
        }
    }, [isSorting, currentStep, steps, speed]);

    useEffect(() => {
        if (steps[currentStep] && isSorting) {
            setArray([...steps[currentStep].array]);
        }
    }, [currentStep, steps, setArray, isSorting]);

    useEffect(() => {
        if(selectedAlgorithm){
            setSteps([]);
            setCurrentStep(0);
        }
    }, [selectedAlgorithm]);

    return {
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
    };
};

export default useSorting;