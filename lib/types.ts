export interface Media {
  url: string
  type: "image" | "video"
}

export interface Establishment {
  id: number
  name: string
  location: string
  province: string
  description: string | null
  mediaUrls: string
  upvotes: number
  verified: boolean
  createdAt: Date | string
}

export interface Report {
  id: number
  establishmentId: number
  testimony: string
  mediaUrls: string
  reporterName: string | null
  upvotes: number
  createdAt: Date | string
}

export type SortOption = "newest" | "most-reported" | "alphabetical"

export interface ProvinceOption {
  value: string
  label: string
}
