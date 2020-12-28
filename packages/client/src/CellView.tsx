import './Cell.css'
import { Borders, CellData } from '@tris/common'
import { useCellScale } from './CellScale'

interface Props {
  type: CellData
  color?: string
  borders?: number
}

export default function CellView({ type, color, borders }: Props) {
  const scale = useCellScale()
  const styles: any = { background: color }

  if (typeof borders === 'number') {
    const color = 'rgba(0,0,0,0.1)'
    if (borders & Borders.Bottom) {
      styles.borderBottomColor = color
    }
    if (borders & Borders.Right) {
      styles.borderRightColor = color
    }
    if (borders & Borders.Left) {
      styles.borderLeftColor = 'transparent'
    }

    if (borders & Borders.Top) {
      styles.borderTopColor = 'transparent'
    }
  }

  styles.width = styles.height = 32 * scale

  return <div className={`cell cell-${type}`} style={styles} />
}
