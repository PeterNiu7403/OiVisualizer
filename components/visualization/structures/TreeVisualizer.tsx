'use client';

import React from 'react';
import * as d3 from 'd3';
import type { TreeNode } from '@/types';

interface TreeVisualizerProps {
  data: any;
}

export function TreeVisualizer({ data }: TreeVisualizerProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;

    // 创建树布局
    const treeLayout = d3.tree().size([width - 100, height - 100]);

    // 转换数据为 D3 树格式
    const root = d3.hierarchy(data);
    treeLayout(root);

    const g = svg
      .append('g')
      .attr('transform', 'translate(50, 50)');

    // 绘制连接线
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2);

    // 绘制节点
    const nodes = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    nodes
      .append('circle')
      .attr('r', 25)
      .attr('fill', '#10b981')
      .attr('stroke', '#059669')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        d3.select(this).attr('fill', '#34d399');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#10b981');
      });

    nodes
      .append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text((d) => d.data.value);
  }, [data]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">树为空</p>
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
