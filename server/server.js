const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors({
	origin: 'http://localhost:3000',
	methods: ['GET', 'POST']
}));
app.use(express.json());

app.post('/bubble-sort', (req, res) => {
	const { array } = req.body;
	const steps = [];
	let arr = [...array];
	let swapped;

	do{
		swapped = false;

		for(let i = 0; i < arr.length - 1; i++){
			steps.push({
				array: [...arr],
				comparedIndices: [i, i + 1],
				swapped: false
			});

			if(arr[i] > arr[i + 1]){
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				swapped = true;
				
				steps.push({
					array: [...arr],
					comparedIndices: [i, i + 1],
					swapped: true
				});
			}
		}
	} while(swapped);

	res.json({ steps });
});

app.post('/quick-sort', (req, res) => {
    const { array } = req.body;
    const steps = [];
    let arr = [...array];

    const quickSort = (arr, low, high) => {
        if (low < high) {
            let pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    };

    const partition = (arr, low, high) => {
        let pivot = arr[high];
        let pi = high;
        let i = low - 1;

        //add step for selecting the pivot
        steps.push({
            array: [...arr],
            comparedIndices: [high],
            pivotIndex: pi,
            swapped: false
        });

        for(let j = low; j < high; j++){
            steps.push({
                array: [...arr],
                comparedIndices: [j],
                pivotIndex: pi,
                swapped: false
            });

            if(arr[j] < pivot){
                i++;

                steps.push({
                    array: [...arr],
                    comparedIndices: [i, j],
                    pivotIndex: pi,
                    swapped: true
                });

                [arr[i], arr[j]] = [arr[j], arr[i]];

                steps.push({
                    array: [...arr],
                    comparedIndices: [i, j],
                    pivotIndex: pi,
                    swapped: true
                });
            }
        }

		//add step for swapping the pivot into its final position
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push({
            array: [...arr],
            comparedIndices: [i + 1, high],
            pivotIndex: pi,
			swapped: true,
			isPivotSwap: true,
			partitionIndex: i + 1
		});
		return i + 1;
	};

    quickSort(arr, 0, arr.length - 1);
    res.json({ steps });
});

app.post('/selection-sort', (req, res) => {
    const { array } = req.body;
    const steps = [];
    let arr = [...array];

    for(let i = 0; i < arr.length; i++){
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            steps.push({
                array: [...arr],
                comparedIndices: [minIdx, j],
                swapped: false
            });

            if(arr[j] < arr[minIdx]){
                minIdx = j;
            }
        }

        if(minIdx !== i){
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            steps.push({
                array: [...arr],
                comparedIndices: [i, minIdx],
                swapped: true
            });
        }
    }

    res.json({ steps });
});

app.post('/insertion-sort', (req, res) => {
    const { array } = req.body;
    const steps = [];
    let arr = [...array];

    for(let i = 1; i < arr.length; i++){
        let key = arr[i];
        let j = i - 1;

        //current element
        steps.push({
            array: [...arr],
            comparedIndices: [],
            selectedElement: i,
            swapped: false,
            isInitialSelection: true
        });

        let swap = false;
        //create a new array without the current element
        let tempArr = [...arr];
        tempArr.splice(i, 1);

        while(j >= 0 && arr[j] > key){
            //create a new array without the current element and add it at position j + 1
            let currTempArr = [...tempArr];
            currTempArr.splice(j + 1, 0, key); 

            //show the current element at j + 1
            steps.push({
                array: currTempArr,
                comparedIndices: [j, j + 1],
                selectedElement: j + 1,
                swapped: false
            });
            
            arr[j + 1] = arr[j];
            tempArr = [...arr];
            tempArr.splice(j + 1, 1); //delete the current element at j + 1
            
            //create a new array with the current element at j
            let shiftArr = [...tempArr];
            shiftArr.splice(j, 0, key); 

            //shift
            steps.push({
                array: shiftArr,
                comparedIndices: [j, j + 1],
                selectedElement: j,
                swapped: true
            });
            
            swap = true;
            j--;
        }
        
        arr[j + 1] = key;
        
        steps.push({
            array: [...arr],
            comparedIndices: [j + 1],
            selectedElement: j + 1,
            swapped: swap,
            isFinalPlacement: true
        });
    }

    res.json({ steps });
});

app.post('/merge-sort', (req, res) => {
    const { array } = req.body;
    const steps = [];
    let arr = [...array];

    const mergeSort = (arr, left, right) => {
        if(left < right){
            const mid = Math.floor((left + right) / 2);
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    };

    const merge = (arr, left, mid, right) => {
        const n1 = mid - left + 1;
        const n2 = right - mid;

        const L = [];
        const R = [];

        for(let i = 0; i < n1; i++){
            L.push(arr[left + i]);
        }
        for(let j = 0; j < n2; j++){
            R.push(arr[mid + 1 + j]);
        }

        let i = 0;
        let j = 0;
        let k = left;

        while(i < n1 && j < n2){
            steps.push({
                array: [...arr],
                comparedIndices: [left + i, mid + 1 + j],
                swapped: false
            });

            if(L[i] <= R[j]){
                arr[k] = L[i];
                steps.push({
                    array: [...arr],
                    comparedIndices: [k],
                    swapped: true
                });
                i++;
            } else{
                arr[k] = R[j];
                steps.push({
                    array: [...arr],
                    comparedIndices: [k],
                    swapped: true
                });
                j++;
            }
            k++;
        }

        while(i < n1){
            arr[k] = L[i];
            steps.push({
                array: [...arr],
                comparedIndices: [k],
                swapped: true
            });
            i++;
            k++;
        }

        while(j < n2){
            arr[k] = R[j];
            steps.push({
                array: [...arr],
                comparedIndices: [k],
                swapped: true
            });
            j++;
            k++;
        }
    };

    mergeSort(arr, 0, arr.length - 1);
    res.json({ steps });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});