import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './styles.css';

const HIGHLIGHT = 'red';
const NORMAL = '#005340';

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
        const width = 800;
        const height = 200;

        //only clear on initial render
        if (!svg.select('g').size()) {
        svg.selectAll('*').remove();
        svg.append('g');
        }

        const xScale = d3.scaleBand()
        .domain(d3.range(array.length))
        .range([0, width])
        .padding(0.5);

        const yScale = d3.scaleLinear()
        .domain([0, d3.max(array) || 0])
        .range([height - 50, 0]);

        const key = d => d;

        const bars = svg.select('g')
        .selectAll('.bar-group')
        .data(array, key);

        const barsEnter = bars.enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', (_, i) => `translate(${xScale(i)},0)`);

        barsEnter.append('rect')
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d))
        .attr('height', d => height - 30 - yScale(d))
        .attr('fill', NORMAL);

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
        .attr('fill', (_, i) => 
            steps && steps[currentStep]?.comparedIndeces?.includes(i) 
            ? HIGHLIGHT 
            : NORMAL
        )
        .attr('y', d => yScale(d))
        .attr('height', d => height - 30 - yScale(d));

        allBars.select('text')
        .transition()
        .duration(isSorting ? speed + 100: 0)
        .attr('y', d => yScale(d) - 5)
        .text(d => d);

        //remove old elements
        bars.exit().remove();

        //add drag behavior
        const drag = d3.drag()
        .on('start', function(event) {
            if (isSorting) return;
            d3.select(this).raise();
        })
        .on('drag', function(event, d) {
            if (isSorting) return;
            
            const currentIndex = array.indexOf(d);
            const newIndex = Math.floor(event.x / xScale.step());
            
            //only swap if we're at a new valid position
            if (newIndex >= 0 && newIndex < array.length && newIndex !== currentIndex) {
            swapElements(currentIndex, newIndex);
            }
            
            //update visual position during drag
            d3.select(this)
            .attr('transform', `translate(${event.x},0)`);
        })
        .on('end', function(event, d) {
            if (isSorting) return;
            
            const finalIndex = Math.floor(event.x / xScale.step());
            const clampedIndex = Math.max(0, Math.min(array.length - 1, finalIndex));
            
            d3.select(this)
            .classed('active', false)
            .transition()
            .duration(speed)
            .attr('transform', `translate(${xScale(clampedIndex)},0)`);
        });

        allBars.call(drag)
        .on('click', function(event, d) {
            if (event.defaultPrevented) return;
            const index = array.indexOf(d);
            removeElement(index);
        });

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
        <svg 
        ref={svgRef} 
        width={800} 
        height={200}
        style={{ overflow: 'visible' }}
        />
    );
};

export default ArrayCanvas;