// Sub interfaces
interface itemRow {
  item_name: string
  item_customname: string | null
  item_url: string
  item_id: string
  position: number
  item_wear_name?: string
  item_paint_wear?: number
  item_origin: number
  item_moveable: boolean
  item_has_stickers: boolean
  equipped_ct: boolean
  equipped_t: boolean
  def_index: number
  stickers: Array<string>
  rarity?: number
  rarityName: string
  tradeUp: boolean
  stattrak: boolean
  tradeUpConfirmed: boolean
  collection?: string
}
