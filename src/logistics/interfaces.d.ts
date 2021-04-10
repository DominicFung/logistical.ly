interface data {
  company: string, 
  lane: string, 
  price: number, 
  capacity: number,
  allocation?: number
}

interface rowData {
  lane: string,
  companies: {
    [company: string]: string
  }
}

interface item {
  price: number,
  capacity: number
}