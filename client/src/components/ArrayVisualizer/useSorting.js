import { useState, useEffect, useCallback } from 'react';

const useSorting = (array, setArray) => {
    const [isSorting, setIsSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState([]);
    const [speed, setSpeed] = useState(1000);
    const [isDragging, setIsDragging] = useState(false);
    const [isManualStep, setIsManualStep] = useState(false);

    const fetchSortingSteps = useCallback(async () => {
        if(isDragging) return;
        try{
            const response = await fetch('http://localhost:5000/bubble-sort', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ array })
            });
            const data = await response.json();
            return [{ array: array }, ...data.steps];
        } catch(error){
            console.error(error);
            return [];
        }
    }, [array]);

    const startSorting = async () => {
        if(isDragging) return;

        const generatedSteps = await fetchSortingSteps();
        setSteps(generatedSteps);
        setIsSorting(true);
    };

    const resetSorting = () => {
        setIsSorting(false);
        setCurrentStep(0);
        if(steps.length > 0) setArray(steps[0].array);
        setSteps([]);
    };

    const goToStart = async () => {
        let workingSteps = steps;
        
        if(workingSteps.length === 0){
            workingSteps = await fetchSortingSteps();
            setSteps(workingSteps);
        }

        setIsManualStep(true);
        setCurrentStep(0);
        setArray(workingSteps[0].array);
        setTimeout(() => setIsManualStep(false), speed);
        setIsSorting(false);
    }

    const goToEnd = async () => {
        const workingSteps = await fetchSortingSteps();
        setSteps(workingSteps);

        setIsManualStep(true);
        setCurrentStep(workingSteps.length - 1);
        setArray(workingSteps[workingSteps.length - 1].array);
        setTimeout(() => setIsManualStep(false), speed);
        setIsSorting(false);
    }

    const goPrev = () => {
        if(steps.length === 0) return;

        const newStep = Math.max(0, currentStep - 1);
        if(newStep !== currentStep){
            setIsManualStep(true);
            setCurrentStep(newStep);
            setArray(steps[newStep].array);
            setTimeout(() => setIsManualStep(false), speed);
        }

        setIsSorting(false);
    };

    const goNext = async () => {
        let workingSteps = steps;

        if(workingSteps.length === 0){
            workingSteps = await fetchSortingSteps();
            setSteps(workingSteps);
        }

        if(workingSteps.length > 0 && currentStep < workingSteps.length - 1){
            const newStep = currentStep + 1;
            setCurrentStep(newStep);
            setArray(workingSteps[newStep].array);
            if(newStep !== currentStep){
                setIsManualStep(true);
                setTimeout(() => setIsManualStep(false), speed);
            }
        }

        setIsSorting(false);
    }

    const pauseSorting = () => {
        setIsSorting(false);
    };

    useEffect(() => {
        if(steps[currentStep]){
            setArray([...steps[currentStep].array]);
        }
    }, [currentStep, steps, setArray]);

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

    // add effect to detect array changes during sorting
    useEffect(() => {
        if (isSorting) {
            startSorting();
        }
    }, [array.length]);

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