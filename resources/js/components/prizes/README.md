# Prizes Components

A collection of reusable React components for managing and displaying prizes in the application.

## Components

### PrizeCard

A card component that displays information about a single prize.

**Props:**

- `prize`: The prize object to display (required)
- `onRedeem`: Callback function when the redeem button is clicked (optional)
- `className`: Additional CSS classes (optional)

**Example:**

```tsx
import { PrizeCard } from '@/components/prizes'
;<PrizeCard prize={prize} onRedeem={(prize) => handleRedeem(prize)} className='custom-class' />
```

### PrizeGrid

A responsive grid layout for displaying multiple PrizeCard components.

**Props:**

- `prizes`: Array of prize objects to display (required)
- `loading`: Boolean indicating if prizes are being loaded (optional, default: false)
- `onRedeem`: Callback function when a prize is redeemed (optional)
- `emptyMessage`: Custom message to display when no prizes are found (optional)
- `skeletonCount`: Number of skeleton loaders to show when loading (optional, default: 8)
- `className`: Additional CSS classes (optional)

**Example:**

```tsx
import { PrizeGrid } from '@/components/prizes'
;<PrizeGrid prizes={prizes} loading={isLoading} onRedeem={handleRedeem} emptyMessage='No prizes found' skeletonCount={6} className='my-4' />
```

### PrizeFilters

A component for filtering and sorting prizes.

**Props:**

- `search`: Current search query (required)
- `onSearchChange`: Callback when search query changes (required)
- `sortBy`: Current sort option (required)
- `onSortChange`: Callback when sort option changes (required)
- `filters`: Current filter values (required)
  - `inStock`: Boolean to filter by in-stock items
  - `activeOnly`: Boolean to filter by active items
  - `minPoints`: Minimum points filter
  - `maxPoints`: Maximum points filter
- `onFilterChange`: Callback when any filter changes (required)
- `onReset`: Callback to reset all filters (required)
- `activeFilterCount`: Number of active filters (required)
- `className`: Additional CSS classes (optional)

**Example:**

```tsx
import { PrizeFilters } from '@/components/prizes'

const [search, setSearch] = useState('')
const [sortBy, setSortBy] = useState('name_asc')
const [filters, setFilters] = useState({
  inStock: false,
  activeOnly: true,
  minPoints: '',
  maxPoints: ''
})

const activeFilterCount = Object.values(filters).filter(Boolean).length

const handleFilterChange = (newFilters) => {
  setFilters((prev) => ({ ...prev, ...newFilters }))
}

const resetFilters = () => {
  setFilters({
    inStock: false,
    activeOnly: false,
    minPoints: '',
    maxPoints: ''
  })
  setSearch('')
}

;<PrizeFilters
  search={search}
  onSearchChange={setSearch}
  sortBy={sortBy}
  onSortChange={setSortBy}
  filters={filters}
  onFilterChange={handleFilterChange}
  onReset={resetFilters}
  activeFilterCount={activeFilterCount}
  className='mb-6'
/>
```

### PrizeManagement

A complete prize management interface that combines all prize components.

**Props:**

- `initialPrizes`: Initial array of prizes (optional)
- `canManage`: Boolean to enable management features (create, edit, delete) (optional, default: false)
- `onRedeem`: Callback when a prize is redeemed (optional)
- `showRedeemButton`: Boolean to show/hide the redeem button (optional, default: false)
- `className`: Additional CSS classes (optional)

**Example:**

```tsx
import { PrizeManagement } from '@/components/prizes';

// Basic usage (view only)
<PrizeManagement />

// With management features
<PrizeManagement
  canManage={true}
  onRedeem={(prize) => handleRedeem(prize)}
  showRedeemButton={true}
  className="my-8"
/>
```

## Utility Functions

### formatPrizePrice(points: number): string

Formats a number as a price with thousands separators.

### formatAvailableUntil(dateString: string | null): string

Formats a date string in a user-friendly way.

### getPrizeStatus(prize: Prize): { text: string, variant: string }

Gets the status of a prize (Available, Out of Stock, Expired, Inactive).

### validatePrizeImage(file: File): { valid: boolean, message?: string }

Validates a prize image file.

### getPrizeImageUrl(imagePath: string | null): string

Gets the full URL for a prize image.

### formatStockInfo(stock: number): string

Formats stock information (e.g., "5 available", "Last 2 items").

### isPrizeAvailable(prize: Prize): boolean

Checks if a prize is available for redemption.

### sortPrizes(prizes: Prize[], sortBy: SortOption): Prize[]

Sorts an array of prizes based on the specified sort option.

## Types

### Prize

```typescript
interface Prize {
  id: number
  name: string
  description?: string
  points_cost: number
  stock: number
  is_active: boolean
  available_until?: string
  image?: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
}
```

### SortOption

```typescript
type SortOption = 'name_asc' | 'name_desc' | 'points_asc' | 'points_desc' | 'newest' | 'oldest'
```

## Usage with React Query

The `PrizeManagement` component works well with React Query for data fetching and caching:

```tsx
import { useQuery } from '@tanstack/react-query'
import { PrizeManagement } from '@/components/prizes'

function PrizesPage() {
  const {
    data: prizes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['prizes'],
    queryFn: fetchPrizes // Your API function to fetch prizes
  })

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-2xl font-bold'>Prizes</h1>
      <PrizeManagement initialPrizes={prizes || []} loading={isLoading} error={error} canManage={true} />
    </div>
  )
}
```
