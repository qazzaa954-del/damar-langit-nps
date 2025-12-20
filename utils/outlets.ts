export type Outlet = {
  id: string
  name: string
  barcode: string
  displayName: string
}

export const OUTLETS: Outlet[] = [
  {
    id: 'damar-langit-resort',
    name: 'damar-langit-resort',
    barcode: 'DLR001',
    displayName: 'Damar Langit Resort'
  },
  {
    id: 'damar-langit-dining',
    name: 'damar-langit-dining',
    barcode: 'DLD002',
    displayName: 'Damar Langit Dining'
  },
  {
    id: 'the-kedai',
    name: 'the-kedai',
    barcode: 'TKD003',
    displayName: 'The Kedai'
  },
  {
    id: 'pakis-raja-coffee',
    name: 'pakis-raja-coffee',
    barcode: 'PRC004',
    displayName: 'Pakis Raja Coffee'
  },
  {
    id: 'damar-tea-patisserie',
    name: 'damar-tea-patisserie',
    barcode: 'DTP005',
    displayName: 'Damar Tea & Patisserie'
  }
]

export function getOutletByBarcode(barcode: string): Outlet | undefined {
  return OUTLETS.find(outlet => outlet.barcode === barcode)
}

export function getOutletById(id: string): Outlet | undefined {
  return OUTLETS.find(outlet => outlet.id === id)
}

