import { useState } from 'react';

const useGraphState = (initial = {}) => {
    const [graph, setGraph] = useState(initial);
    const [initialGraph, setInitialGraph] = useState({...initial});

    const resetGraph = () => {
        setGraph({...initialGraph});
    };

    const addNode = (node) => {
        const strNode = String(node);

        if(strNode && !isNaN(Number(strNode)) && !graph[strNode]){
            setGraph(prevGraph => ({
               ...prevGraph,
               [strNode]: {} 
            }));

            return true;
        }
        
        return false;
    };

    const addEdge = (src, dest, weight) => {
        const strSrc = String(src);
        const strDest = String(dest);

        if(!graph[strSrc] || !graph[strDest]) return false;

        const numWeight = Number(weight);
        if(isNaN(numWeight) || numWeight <= 0) return false;

        setGraph(prevGraph => ({
            ...prevGraph, 
            [strSrc]: {
                ...prevGraph[strSrc],
                [strDest]: numWeight
            }
        }));

        return true;
    };

    //temporary value
    const setRandomGraph = (nodeCount = 9) => {
        const nodes = Array.from({ length: nodeCount }, (_, i) => String(i + 1));
        const randomGraph = {};

        nodes.forEach(node => {
            randomGraph[node] = {};
        });

        //add random edges
        nodes.forEach(src => {
            //each node has 0-3 edges
            const edgeCount = Math.floor(Math.random() * 4);
            //target cannot be the node itself
            const targets = [...nodes].filter(n => n !== src);

            for(let i = 0; i < Math.min(edgeCount, targets.length); i++){
                //1 <= weight <= 15
                randomGraph[src][targets[i]] = Math.floor(Math.random() * 15) + 1;
            } 
        });

        setGraph(randomGraph);
        setInitialGraph({...randomGraph});
        return randomGraph;
    };

    return {
        graph,
        setGraph,
        initialGraph,
        setInitialGraph,
        resetGraph,
        addNode,
        addEdge,
        setRandomGraph      
    }; 
};

export default useGraphState;