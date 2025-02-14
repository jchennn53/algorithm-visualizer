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
				comparedIndeces: [i, i + 1],
				swapped: false
			});

			if(arr[i] > arr[i + 1]){
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				swapped = true;
				
				steps.push({
					array: [...arr],
					comparedIndeces: [i, i + 1],
					swapped: true
				});
			}
		}
	} while(swapped);

	res.json({ steps });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});