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
            tempArr.splice(j + 1, 1); //delete the element at j + 1
            
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
    
    const mergeSort = (arr, left, right) => {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            //show the current subarray
            steps.push({
                array: [...arr],
                mergeIndices: { 
                    left: left,
                    right: right,
                    mid: mid
                },
                dividing: true 
            });
            
            arr = mergeSort(arr, left, mid);
            arr = mergeSort(arr, mid + 1, right);
            arr = merge(arr, left, mid, right);
        }
        return arr;
    };
    
    const merge = (arr, left, mid, right) => {
        let i = left;
        let j = mid + 1;
        
        while(i <= mid && j <= right){
            steps.push({
                array: [...arr],
                comparedIndices: [i, j],
                comparing: true,
                description: 'compare'
            });
            
            if(arr[j] < arr[i]){
                const valueToInsert = arr[j];
                
                steps.push({
                    array: [...arr],
                    comparedIndices: [i, j],
                    swapped: true,
                    description: 'swap-needed'
                });
                
                let tempArr = [...arr];
                //shift the elements to the right to make space for the value to insert
                for(let k = j; k > i; k--){
                    tempArr[k] = tempArr[k - 1];
                }
                tempArr[i] = valueToInsert;
                
                steps.push({
                    array: [...tempArr],
                    comparedIndices: [i, i + 1],
                    swapped: true,
                    description: 'swapped'
                });
                
                arr = [...tempArr];
                j++;
                mid++;
            }
            i++;
        }
        
        return arr;
    };
    
    let result = mergeSort([...array], 0, array.length - 1);

    steps.push({
        array: [...result],
        completed: true
    });
    
    res.json({ steps });
});

//--------------------GRAPH ALGORITHMS--------------------
app.post('/breadth-first-search', (req, res) => {
    const { graph, startNode } = req.body;
    const steps = [];

    //initialize visited object
    const visited = {};
    Object.keys(graph).forEach(node => {
        visited[node] = false;
    });

    //initialize queue
    const queue = [startNode];
    visited[startNode] = true;

    //add step for starting the algorithm
    steps.push({
        visited: {...visited},
        queue: [...queue],
        neighbors: [],
        current: startNode,
        isStartNode: true,
    });

    while(queue.length > 0){
        const currentNode = queue.shift();
        
        //add step for selecting a node
        steps.push({
            visited: {...visited},
            queue: [...queue],
            neighbors:[],
            current: currentNode,
            isSelected: true
        });

        const neighbors = graph[current] || [];

        for(const neighbor of neighbors){
            steps.push({
                visited: {...visited},
                queue: [...queue],
                current: currentNode,
                neighbors: [neighbor],
                isVisiting: true,
            });

            if(!visited[neighbor]){
                visited[neighbor] = true;
                queue.push(neighbor);
                //add step for discovering the neighbor
                steps.push({
                    visited: {...visited},
                    queue: [...queue],
                    current: currentNode,
                    neighbors: [neighbor],
                    isNotVisited: true
                });
            } else{
                //add step for already visited neighbor
                steps.push({
                    visited: {...visited},
                    queue: [...queue],
                    current: currentNode,
                    neighbors: [neighbor],
                    isVisited: true
                });
            }
        }
    }

    steps.push({
        visited: {...visited},
        queue: [...queue],
        current: null,
        neighbors: [],
        isFinished: true
    });

    res.json({ steps });
});

app.post('/depth-first-search', (req, res) => {
    const { graph, startNode } = req.body;
    const steps = [];

    const visited = {};
    Object.keys(graph).forEach(node => {
        visited[node] = false;
    });

    const stack = [startnode];

    //add step for starting the algorithm
    steps.push({
        visited: {...visited},
        stack: [...stack],
        neighbors: [],
        current: startNode,
        isStartNode: true,
    });

    while(stack.length > 0){
        const currentNode = stack.pop();  

        if(visited[currentNode]){
            continue;
        }

        visited[currentNode] = true;

        //add step for selecting the current node
        steps.push({
            visited: {...visited},
            stack: [...stack],
            current: currentNode,
            neighbors: [],
            isSelected: true 
        });

        //reverse because of the stack, so the last added neighbor is processed first
        const neighbors = [...(graph[currentNode] || [])].reverse(); 

        for(const neighbor of neighbors){
            steps.push({
                visited: {...visited},
                stack: [...stack],
                current: currentNode,
                neighbors: [neighbor],
                isVisiting: true,
            });

            if(!visited[neighbor]){
                stack.push(neighbor);

                //add step for discovering the neighbor
                steps.push({
                    visited: {...visited},
                    stack: [...stack],
                    current: currentNode,
                    neighbors: [neighbor],
                    isNotVisited: true
                });
            } else{
                //add step for already visited neighbor
                steps.push({
                    visited: {...visited},
                    stack: [...stack],
                    current: currentNode,
                    neighbors: [neighbor],
                    isVisited: true
                });
            }
        }
    }

    steps.push({
        visited: {...visited},
        stack: [...stack],
        current: null,
        neighbors: [],
        isFinished: true
    });

    res.json({ steps });
});

app.post('/dijkstra', (req, res) => {
    const { graph, startNode } = req.body;
    const steps = [];

    const distances = {};
    const visited = {};
    const previous = {};    

    Object.keys(graph).forEach(node => {
        distances[node] = Infinity;
        visited[node] = false;
        previous[node] = null;
    });

    distances[startNode] = 0;

    //add step for starting the algorithm
    steps.push({
        distances: {...distances},
        visited: {...visited},
        previous: {...previous},
        current: startNode,
        isStartNode: true
    });

    while(true){
        let currentNode = null;
        let minDistance = Infinity;

        //find the node with the smallest distance that has not been visited - NOT THE MOST EFFICIENT WAY
        Object.keys(distances).forEach(node => {
            if(!visited[node] && distances[node] < minDistance){
                minDistance = distances[node];
                currentNode = node;
            }
        });

        //if all nodes have been visited or the smallest distance is infinity, break
        if(currentNode === null || distances[currentNode] === Infinity){
            break;
        }

        visited[currentNode] = true;

        //add step for visiting the current node
        steps.push({
            distances: {...distances},
            visited: {...visited},
            previous: {...previous},
            current: currentNode,
            isSelected: true 
        });

        const neighbors = graph[currentNode] || {};

        for(const neighbor in neighbors){
            const weight = neighbors[neighbor];

            if(weight !== undefined){
                const distance = distances[currentNode] + weight;

                //add step for comparing the new distance with the current distance
                steps.push({
                    distances: {...distances},
                    visited: {...visited},
                    previous: {...previous},
                    current: currentNode,
                    neighbors: [neighbor],
                    isVisiting: true,
                    newDistance: distance,
                    currentDistance: distances[neighbor]
                });

                if(distance < distances[neighbor]){
                    distances[neighbor] = distance;
                    previous[neighbor] = currentNode;

                    //add step for updating the distance and previous node
                    steps.push({
                        distances: {...distances},
                        visited: {...visited},
                        previous: {...previous},
                        current: currentNode,
                        neighbors: [neighbor],
                        isUpdated: true
                    });
                } else{
                    //add step for not updating the distance and previous node
                    steps.push({
                        distances: {...distances},
                        visited: {...visited},
                        previous: {...previous},
                        current: currentNode,
                        neighbors: [neighbor],
                        isNotUpdated: true
                    });
                }
            }
        }
    }

    const paths = {};
    for(const node in distances){
        if(distances[node] < Infinity){
            let revPath = [];
            let currentNode = node;

            while(currentNode !== null){
                revPath.push(currentNode);
                currentNode = previous[currentNode];
            }

            paths[node] = {
                distance: distances[node],
                path: revPath.reverse()
            };
        }
    }
    
    //add step for showing the shortest path
    steps.push({
        distances: {...distances},
        visited: {...visited},
        previous: {...previous},
        paths: paths,
        isFinished: true
    });

    res.json({ steps });
});


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});