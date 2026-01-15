'use client';

import React from 'react';
import * as d3 from 'd3';

interface ArrayVisualizerProps {
  data: any[];
}

/**
 * 数组可视化组件
 * 使用 D3.js 渲染数组元素
 */
export function ArrayVisualizer({ data }: ArrayVisualizerProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const cellSize = 60;
    const gap = 10;

    // 计算数组居中位置
    const totalWidth = data.length * (cellSize + gap) - gap;
    const startX = (width - totalWidth) / 2;
    const startY = (height - cellSize) / 2;

    const g = svg
      .append('g')
      .attr('transform', `translate(${startX}, ${startY})`);

    // 绘制数组元素
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('id', (_, i) => `array-${i}`)
      .attr('x', (_, i) => i * (cellSize + gap))
      .attr('y', 0)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('rx', 4)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#1d4ed8')
      .attr('stroke-width', 2);

    // 绘制索引
    g.selectAll('.index')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'index')
      .attr('x', (_, i) => i * (cellSize + gap) + cellSize / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '12px')
      .text((_, i) => i);

    // 绘制值
    g.selectAll('.value')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value')
      .attr('x', (_, i) => i * (cellSize + gap) + cellSize / 2)
      .attr('y', cellSize / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text((d) => String(d));

    // 添加交互
    g.selectAll('rect')
      .on('mouseover', function () {
        d3.select(this).attr('fill', '#60a5fa').attr('cursor', 'pointer');
      })
      .on('mouseout', function (_, d) {
        d3.select(this).attr('fill', '#3b82f6');
      })
      .on('click', function (event, d) {
        const index = data.indexOf(d);
        alert(`索引 ${index}: 值 ${d}`);
      });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">数组为空</p>
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 800 400"
      className="max-w-full"
    />
  );
}
