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
            pivotIndex: high,
            swapped: false
        });

        for (let j = low; j < high; j++) {
            steps.push({
                array: [...arr],
                comparedIndices: [j],
                pivotIndex: pi,
                swapped: false
            });

            if (arr[j] < pivot) {
                i++;
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
            swapped: true
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

    for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            steps.push({
                array: [...arr],
                comparedIndices: [minIdx, j],
                swapped: false
            });

            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
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

    for (let i = 1; i < arr.length; i++){
		let key = arr[i];
		let j = i - 1;

		while(j >= 0 && arr[j] > key){
			arr[j + 1] = arr[j];
			j--;
		}
		arr[j + 1] = key;
		steps.push({
			array: [...arr],
			comparedIndices: [j + 1, i],
			swapped: true
		});
	}

	res.json({ steps });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});