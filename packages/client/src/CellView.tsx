import './Cell.css'
import { Borders, CellData } from '@tris/common'

interface Props {
  type: CellData
  color?: string
  borders?: number
}

export default function CellView({ type, color, borders }: Props) {
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
  return <div className={`cell cell-${type}`} style={styles} />
}
