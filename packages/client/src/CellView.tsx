import './Cell.css'
import { CellData } from '@tris/common'

interface Props {
  type: CellData
  color?: string
}

export default function CellView({ type, color }: Props) {
  return <div className={`cell cell-${type}`} style={{ background: color }} />
}
