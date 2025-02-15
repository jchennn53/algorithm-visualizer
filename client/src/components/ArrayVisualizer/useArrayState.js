import { useState } from 'react';

const useArrayState = (initial = []) => {
    const [array, setArray] = useState(initial);

    const addElement = (element) => {
        if(element !== '' && !isNaN(element) && array.length < 10){
            setArray(arr => [...arr, Number(element)]);
        }
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
    };

    const swapElements = (i, j) => {
        setArray(arr => {
            const newArr = [...arr];
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            return newArr;
        });
    };

    return { array, setArray, addElement, removeElement, updateElement, setRandomArray, swapElements };
};

export default useArrayState;