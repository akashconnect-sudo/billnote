'use client'

export type SparklineProps = {
  values: number[]
  width?: number
  height?: number
  className?: string
}

export function Sparkline({ values, width = 120, height = 28, className }: SparklineProps) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - ((v - min) / span) * (height - 4) - 2
    return `${x},${y}`
  })
  const d = `M ${points.join(' L ')}`

  return (
    <svg
      className={className ? `bn-sparkline ${className}` : 'bn-sparkline'}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}
