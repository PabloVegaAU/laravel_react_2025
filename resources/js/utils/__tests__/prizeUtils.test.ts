import {
  formatAvailableUntil,
  formatPrizePrice,
  formatStockInfo,
  getPrizeImageUrl,
  getPrizeStatus,
  isPrizeAvailable,
  sortPrizes,
  validatePrizeImage
} from '../prizeUtils'

describe('prizeUtils', () => {
  describe('formatPrizePrice', () => {
    it('should format price with thousands separators', () => {
      expect(formatPrizePrice(1000)).toBe('1.000')
      expect(formatPrizePrice(2500)).toBe('2.500')
      expect(formatPrizePrice(1000000)).toBe('1.000.000')
    })

    it('should handle zero and negative numbers', () => {
      expect(formatPrizePrice(0)).toBe('0')
      expect(formatPrizePrice(-1000)).toBe('-1.000')
    })
  })

  describe('formatAvailableUntil', () => {
    it('should format date in Spanish', () => {
      expect(formatAvailableUntil('2023-12-31')).toMatch(/31 de diciembre de 2023/)
    })

    it('should return "Sin fecha límite" for null or undefined', () => {
      expect(formatAvailableUntil(null)).toBe('Sin fecha límite')
      expect(formatAvailableUntil(undefined as any)).toBe('Sin fecha límite')
    })
  })

  describe('getPrizeStatus', () => {
    const now = new Date()
    const futureDate = new Date(now)
    futureDate.setMonth(now.getMonth() + 1)

    const pastDate = new Date(now)
    pastDate.setMonth(now.getMonth() - 1)

    it('should return "Expirado" for expired prizes', () => {
      const prize = {
        available_until: pastDate.toISOString(),
        stock: 5,
        is_active: true
      } as any

      expect(getPrizeStatus(prize)).toEqual({
        text: 'Expirado',
        variant: 'destructive'
      })
    })

    it('should return "Agotado" for out of stock prizes', () => {
      const prize = {
        available_until: futureDate.toISOString(),
        stock: 0,
        is_active: true
      } as any

      expect(getPrizeStatus(prize)).toEqual({
        text: 'Agotado',
        variant: 'outline'
      })
    })

    it('should return "Disponible" for active and in-stock prizes', () => {
      const prize = {
        available_until: futureDate.toISOString(),
        stock: 5,
        is_active: true
      } as any

      expect(getPrizeStatus(prize)).toEqual({
        text: 'Disponible',
        variant: 'success'
      })
    })

    it('should return "Inactivo" for inactive prizes', () => {
      const prize = {
        available_until: futureDate.toISOString(),
        stock: 5,
        is_active: false
      } as any

      expect(getPrizeStatus(prize)).toEqual({
        text: 'Inactivo',
        variant: 'secondary'
      })
    })
  })

  describe('validatePrizeImage', () => {
    it('should validate image file type', () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      expect(validatePrizeImage(file)).toEqual({ valid: true })

      const invalidFile = new File([''], 'test.pdf', { type: 'application/pdf' })
      expect(validatePrizeImage(invalidFile)).toEqual({
        valid: false,
        message: 'El archivo debe ser una imagen (JPEG, PNG, GIF, etc.)'
      })
    })

    it('should validate image file size', () => {
      // Create a 3MB file
      const largeFile = new File([new ArrayBuffer(3 * 1024 * 1024)], 'test.png', { type: 'image/png' })
      expect(validatePrizeImage(largeFile)).toEqual({
        valid: false,
        message: 'La imagen no puede pesar más de 2MB'
      })
    })
  })

  describe('getPrizeImageUrl', () => {
    it('should return placeholder for null or empty path', () => {
      expect(getPrizeImageUrl(null)).toBe('/images/placeholder-prize.png')
      expect(getPrizeImageUrl('')).toBe('/images/placeholder-prize.png')
    })

    it('should return full URL for relative paths', () => {
      expect(getPrizeImageUrl('prizes/test.png')).toBe('/storage/prizes/test.png')
    })

    it('should return the same URL for absolute paths', () => {
      const url = 'https://example.com/images/prize.jpg'
      expect(getPrizeImageUrl(url)).toBe(url)
    })
  })

  describe('formatStockInfo', () => {
    it('should return "Agotado" for zero or negative stock', () => {
      expect(formatStockInfo(0)).toBe('Agotado')
      expect(formatStockInfo(-1)).toBe('Agotado')
    })

    it('should show "Últimas X unidades" for low stock', () => {
      expect(formatStockInfo(1)).toBe('Últimas 1 unidades')
      expect(formatStockInfo(4)).toBe('Últimas 4 unidades')
    })

    it('should show "X disponibles" for normal stock', () => {
      expect(formatStockInfo(5)).toBe('5 disponibles')
      expect(formatStockInfo(10)).toBe('10 disponibles')
    })
  })

  describe('isPrizeAvailable', () => {
    const now = new Date()
    const futureDate = new Date(now)
    futureDate.setMonth(now.getMonth() + 1)

    const pastDate = new Date(now)
    pastDate.setMonth(now.getMonth() - 1)

    it('should return true for available prizes', () => {
      const prize = {
        is_active: true,
        stock: 5,
        available_until: futureDate.toISOString()
      } as any

      expect(isPrizeAvailable(prize)).toBe(true)
    })

    it('should return false for inactive prizes', () => {
      const prize = {
        is_active: false,
        stock: 5,
        available_until: futureDate.toISOString()
      } as any

      expect(isPrizeAvailable(prize)).toBe(false)
    })

    it('should return false for out-of-stock prizes', () => {
      const prize = {
        is_active: true,
        stock: 0,
        available_until: futureDate.toISOString()
      } as any

      expect(isPrizeAvailable(prize)).toBe(false)
    })

    it('should return false for expired prizes', () => {
      const prize = {
        is_active: true,
        stock: 5,
        available_until: pastDate.toISOString()
      } as any

      expect(isPrizeAvailable(prize)).toBe(false)
    })

    it('should handle prizes with no expiration', () => {
      const prize = {
        is_active: true,
        stock: 5,
        available_until: null
      } as any

      expect(isPrizeAvailable(prize)).toBe(true)
    })
  })

  describe('sortPrizes', () => {
    const prizes = [
      { id: 1, name: 'Prize B', points_cost: 200 },
      { id: 2, name: 'Prize A', points_cost: 100 },
      { id: 3, name: 'Prize C', points_cost: 300 }
    ] as any[]

    it('should sort by points ascending', () => {
      const sorted = sortPrizes(prizes, 'points_asc')
      expect(sorted.map((p) => p.id)).toEqual([2, 1, 3])
    })

    it('should sort by points descending', () => {
      const sorted = sortPrizes(prizes, 'points_desc')
      expect(sorted.map((p) => p.id)).toEqual([3, 1, 2])
    })

    it('should sort by name ascending', () => {
      const sorted = sortPrizes(prizes, 'name_asc')
      expect(sorted.map((p) => p.id)).toEqual([2, 1, 3])
    })

    it('should sort by name descending', () => {
      const sorted = sortPrizes(prizes, 'name_desc')
      expect(sorted.map((p) => p.id)).toEqual([3, 1, 2])
    })

    it('should use points_asc as default sort', () => {
      const sorted = sortPrizes(prizes)
      expect(sorted.map((p) => p.id)).toEqual([2, 1, 3])
    })
  })
})
