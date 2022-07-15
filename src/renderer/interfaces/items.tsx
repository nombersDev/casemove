
export interface ItemRow {
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
    combined_ids?: Array<string>
    combined_QTY?: number
    bgColorClass?: string
    category?: string
    major?: string
    storage_id?: string
    item_storage_total?: number
  }

  export interface ItemRowStorage extends ItemRow {
    storage_id: string
    item_storage_total: number
  }



