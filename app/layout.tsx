import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OI Visualizer - 信息学奥赛数据结构可视化教学平台',
  description: '面向信息学竞赛学生的现代化数据结构可视化应用，支持代码与可视化的双向实时绑定',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
