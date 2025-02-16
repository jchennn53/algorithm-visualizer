import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './styles.css';

const HIGHLIGHT = 'red';
const NORMAL = '#005340';
const MIN_BAR_WIDTH = 40;

const ArrayCanvas = ({ 
    array, 
    removeElement, 
    updateElement, 
    steps, 
    currentStep, 
    speed = 500,
    swapElements,
    isManualStep,
    isSorting = false
}) => {
    const svgRef = useRef();
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        
        //required width based on the number of elements
        const requiredWidth = array.length * (MIN_BAR_WIDTH * 2); //double the minimum width to account for padding
        const width = Math.max(800, requiredWidth); //at least 800px or the required width
        const height = 200;

        //update the svg width
        svg.attr('width', width);

        //only clear on initial render
        if (!svg.select('g').size()) {
            svg.selectAll('*').remove();
            svg.append('g');
        }

        const xScale = d3.scaleBand()
            .domain(d3.range(array.length))
            .range([0, width])
            .padding(0.3); //consistent padding between bars

        const yScale = d3.scaleLinear()
            .domain([0, Math.max(d3.max(array) || 0, 1)]) //ensure minimum domain of 1
            .range([height - 50, 20]); //to avoid text overlap

        const key = d => d;

        const bars = svg.select('g')
            .selectAll('.bar-group')
            .data(array, key);

        const barsEnter = bars.enter()
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (_, i) => `translate(${xScale(i)},0)`);

        //create bars with consistent width
        barsEnter.append('rect')
            .attr('width', xScale.bandwidth())
            .attr('y', d => yScale(d))
            .attr('height', d => height - 30 - yScale(d))
            .attr('fill', NORMAL)
            .attr('rx', 4) 
            .attr('ry', 4); 

        //position text above bars
        barsEnter.append('text')
            .text(d => d)
            .attr('x', xScale.bandwidth() / 2)
            .attr('y', d => yScale(d) - 5)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .style('user-select', 'none')
            .style('pointer-events', 'none');

        //update all bars
        const allBars = bars.merge(barsEnter);

        //apply transitions for position and color
        allBars
            .transition()
            .duration(isSorting || isManualStep ? speed : 0)
            .ease(d3.easeCubicInOut)
            .attr('transform', (_, i) => `translate(${xScale(i)},0)`);

        allBars.select('rect')
            .transition()
            .duration(isSorting || isManualStep ? speed : 0)
            .attr('width', xScale.bandwidth()) //ensure consistent width during updates
            .attr('fill', (_, i) => 
                steps && steps[currentStep]?.comparedIndeces?.includes(i) 
                ? HIGHLIGHT 
                : NORMAL
            )
            .attr('y', d => yScale(d))
            .attr('height', d => height - 30 - yScale(d));

        allBars.select('text')
            .transition()
            .duration(isSorting ? speed + 100 : 0)
            .attr('x', xScale.bandwidth() / 2) //center text within bar
            .attr('y', d => yScale(d) - 5)
            .text(d => d);

        //remove old elements
        bars.exit().remove();

        
        //handle editing input
        if (editingIndex !== -1) {
            const inputGroup = svg.append('foreignObject')
                .attr('x', xScale(editingIndex))
                .attr('y', yScale(array[editingIndex]) - 30)
                .attr('width', xScale.bandwidth())
                .attr('height', 30);

            const input = inputGroup.append('xhtml:input')
                .attr('type', 'number')
                .attr('class', 'array-input')
                .property('value', editValue)
                .style('width', '100%')
                .style('padding', '2px')
                .style('box-sizing', 'border-box');

            input.node().focus();
            
            input
                .on('input', (event) => setEditValue(event.target.value))
                .on('blur', () => {
                    const newValue = parseInt(editValue, 10);
                    if (!isNaN(newValue)) {
                        updateElement(editingIndex, newValue);
                    }
                    setEditingIndex(-1);
                })
                .on('keypress', (event) => {
                    if (event.key === 'Enter') {
                        event.target.blur();
                    }
                });
        }
    }, [array, editingIndex, editValue, steps, currentStep, speed, isSorting]);

    return (
        <div style={{ overflowX: 'auto', width: '100%' }}>
            <svg 
                ref={svgRef} 
                height={200}
                style={{ display: 'block', margin: '0 auto' }}
            />
        </div>
    );
};

export default ArrayCanvas;