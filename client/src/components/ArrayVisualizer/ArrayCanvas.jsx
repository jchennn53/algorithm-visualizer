import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './styles.css';

const HIGHLIGHT = 'red';
const PIVOT_COLOR = '#9847f4';
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
    const svgRef = useRef(); //reference to the svg element (d3)
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editValue, setEditValue] = useState('');
    const dragStart = useRef(0); //initial position of the drag

    useEffect(() => {
        //select the svg element
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

        //get current step details
        const current = steps && steps[currentStep] ? steps[currentStep] : {};
        const { comparedIndices = [], pivotIndex = null } = current;

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
            .attr('fill', (_, i) => {
                if (pivotIndex !== null && i === pivotIndex) {
                    return PIVOT_COLOR;
                }
                return comparedIndices.includes(i) ? HIGHLIGHT : NORMAL;
            })
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

        //add drag behavior
        const drag = d3.drag()
            .on('start', function(event, d) {
                if (isSorting) return;
                
                const currentIndex = array.indexOf(d);
                const barX = xScale(currentIndex);
                //calculate offset between cursor and bar's left edge
                dragStart.current = event.x - barX;
                
                d3.select(this)
                    .raise()
                    .classed('dragging', true)
                    .attr('opacity', 0.7);
            })
            .on('drag', function(event) {
                if (isSorting) return;
                //adjust position by subtracting the initial offset
                const adjustedX = event.x - dragStart.current;
                d3.select(this)
                    .attr('transform', `translate(${adjustedX},0)`);
            })
            .on('end', function(event, d) {
                if (isSorting) return;
                
                const startIndex = array.indexOf(d);
                //adjust the final position calculation to account for the offset
                const adjustedX = event.x - dragStart.current;
                const endIndex = Math.min(
                    array.length - 1,
                    Math.max(0, Math.round(adjustedX / xScale.step()))
                );

                if (startIndex !== endIndex) {
                    swapElements(startIndex, endIndex);
                }

                d3.select(this)
                    .classed('dragging', false)
                    .attr('opacity', 1)
                    .transition()
                    .duration(200)
                    .attr('transform', `translate(${xScale(endIndex)},0)`);
            });

        allBars
            .style('cursor', 'grab')
            .call(drag)
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