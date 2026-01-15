'use client';

import React from 'react';
import * as d3 from 'd3';

interface GraphVisualizerProps {
  data: {
    nodes: any[];
    edges: any[];
  };
}

export function GraphVisualizer({ data }: GraphVisualizerProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current || !data || !data.nodes || data.nodes.length === 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;

    // 创建力导向模拟
    const simulation = d3
      .forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.edges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    const g = svg.append('g');

    // 绘制边
    const link = g
      .append('g')
      .selectAll('line')
      .data(data.edges)
      .enter()
      .append('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2);

    // 绘制边的权重标签
    const linkText = g
      .append('g')
      .selectAll('text')
      .data(data.edges.filter((e: any) => e.weight !== undefined))
      .enter()
      .append('text')
      .attr('font-size', '12px')
      .attr('fill', '#64748b')
      .text((d: any) => d.weight);

    // 绘制节点
    const node = g
      .append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', 25)
      .attr('fill', '#f59e0b')
      .attr('stroke', '#d97706')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any
      )
      .on('mouseover', function () {
        d3.select(this).attr('fill', '#fbbf24');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#f59e0b');
      });

    // 绘制节点标签
    const text = g
      .append('g')
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text((d: any) => d.value);

    // 更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkText
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      text.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
    });
  }, [data]);

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">图为空</p>
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
