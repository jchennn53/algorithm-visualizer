import { useState } from 'react';

const useArrayState = (initial = []) => {
    const [array, setArray] = useState(initial);
    const [initialArray, setInitialArray] = useState([...initial]);

    const resetArray = () => {
        setArray([...initialArray]);
    }

    const addElement = (element) => {
        if(element !== '' && !isNaN(element) && array.length < 15){
            setArray(arr => [...arr, Number(element)]);
            return true;
        }
        return false;
    };

    const removeElement = (index) => {
        setArray(arr => arr.filter((_, i) => i !== index));
    };

    const updateElement = (index, value) => {
        if(!isNaN(value)){
            setArray(arr => arr.map((v, i) => i === index ? Number(value) : v));
        }
    };

    const setRandomArray = () => {
        const randomArray = Array.from({length: 8}, () => Math.floor(Math.random() * 50) + 1);
        setArray(randomArray);
        setInitialArray([...randomArray]);
    };

    const swapElements = (i, j) => {
        setArray(arr => {
            const newArr = [...arr];
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            return newArr;
        });
    };

    return { array, setArray, initialArray, resetArray,addElement, removeElement, updateElement, setRandomArray, swapElements };
};

export default useArrayState;