import { useState, useEffect, useCallback } from 'react';

const useSorting = (array, setArray) => {
    //too many states, need to refactor
    const [isSorting, setIsSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); 
    const [steps, setSteps] = useState([]);
    const [speed, setSpeed] = useState(1000);
    const [isDragging, setIsDragging] = useState(false);
    const [isManualStep, setIsManualStep] = useState(false);
    const [initialArray, setInitialArray] = useState([]);

    const fetchSortingSteps = useCallback(async (baseArray) => {
        if(isDragging) return;

        try{
            const response = await fetch('http://localhost:5000/bubble-sort', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ array: baseArray })
            });
            const data = await response.json();
            return [{ array: baseArray }, ...data.steps];
        } catch(error){
            console.error(error);
            return [];
        }
    }, [isDragging]);

    const startSorting = async () => {
        if(isDragging) return;

        if(initialArray.length === 0){
            setInitialArray([...array]);
        }

        const generatedSteps = await fetchSortingSteps(array);
        setSteps(generatedSteps);
        setIsSorting(true);
        setCurrentStep(0); //temporary solution
        setArray([...array]);
    };

    const resetSorting = () => {
        setIsSorting(false);
        setCurrentStep(0);
        setSteps([]);
        setInitialArray([]);
    };

    const goToStart = async () => {
        let workingSteps = steps;
        
        if(workingSteps.length === 0 && initialArray.length > 0){
            workingSteps = await fetchSortingSteps(initialArray);
            setSteps(workingSteps);
        }

        setIsManualStep(true);
        setCurrentStep(0);
        setArray(initialArray);
        setTimeout(() => setIsManualStep(false), speed);
        setIsSorting(false);
        console.log("initialArray", initialArray);
    }

    const goToEnd = async () => {
        let workingSteps = steps;
    
        if(workingSteps.length === 0){
            workingSteps = await fetchSortingSteps(array);
            setSteps(workingSteps);
        }

        if(workingSteps.length > 0){
            const lastStep = workingSteps.length - 1;
            setIsManualStep(true);
            setCurrentStep(lastStep);
            setArray(workingSteps[lastStep].array);
            setTimeout(() => setIsManualStep(false), speed);
        }
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
        if(initialArray.length === 0){
            setInitialArray([...array]);
            console.log("initialArray", initialArray);
        }
        
        let workingSteps = steps;

        if(workingSteps.length === 0){
            workingSteps = await fetchSortingSteps(array);
            setSteps(workingSteps);
        }

        if(workingSteps.length > 0 && currentStep < workingSteps.length - 1){
            const newStep = currentStep + 1;
            setCurrentStep(newStep);
            setArray(workingSteps[newStep].array);
            setIsManualStep(true);
            setTimeout(() => setIsManualStep(false), speed);
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