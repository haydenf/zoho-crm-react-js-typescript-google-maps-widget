export type IntersectedSearchAndFilterParams = SalesEvidenceFilterParams & BaseSearchParamsType

export type BaseSearchParamsType = {
  searchAddress: string
  propertyTypes: string[]
  propertyGroups: string[]
  neighboursSearchMaxRecords: number
  propertyGroupsMaxResults: number
  propertyTypesMaxResults: number
  managed: string[]
  id: string
}

const DEFAULT_SALES_EVIDENCE_PARAMS = {
    landArea: {
        min: -1,
        max: -1
    },
    buildArea: {
        min: -1,
        max: -1
    },
    dateSold: {
        min: new Date(),
        max: new Date()
    },
    salePrice: {
        min: -1,
        max: -1
    },
    saleType: []
}

const DEFAULT_LEASE_EVIDENCE_PARAMS = {
    landArea: {
        min: 0,
        max: 0
    },
    buildArea: {
        min: 0,
        max: 0
    },
    rentGross: {
        min: 0,
        max: 0
    },
    rentDollarMeter: {
        min: 0,
        max: 0
    },
    leasedDate: {
        min: new Date(),
        max: new Date()
    },
    reviewDate: {
        min: new Date(),
        max: new Date()
    }
}
export const DEFAULT_SEARCH_PARAMS = {
    searchAddress: '528 Kent St, Sydney, NSW, 2000',
    propertyGroupsMaxResults: Infinity,
    propertyTypesMaxResults: Infinity,
    neighboursSearchMaxRecords: Infinity,
    propertyTypes: ['All'],
    propertyGroups: ['All'],
    managed: ['All'],
    readyForSearch: false,
    id: `search:${(Math.random() * 1000)}`,
    ...DEFAULT_SALES_EVIDENCE_PARAMS,
    ...DEFAULT_LEASE_EVIDENCE_PARAMS
}

export enum SaleTypeEnum {
  ALL = 'ALL',
  INV = 'INV',
  VP = 'VP',
  DEV = 'DEV'
}

export type MinMaxDateType = {
  min: Date
  max: Date
}

export type MinMaxNumberType = {
  min: number
  max: number
}

export type SalesEvidenceFilterParams = {
  landArea: MinMaxNumberType
  buildArea: MinMaxNumberType
  dateSold: MinMaxDateType
  salePrice: MinMaxNumberType
  saleType: SaleTypeEnum[]
}

export type LeaseEvidenceFilterParams = {
  landArea: MinMaxNumberType
  buildArea: MinMaxNumberType
  rentGross: MinMaxNumberType
  rentDollarMeter: MinMaxNumberType
  leasedDate: MinMaxDateType
  reviewDate: MinMaxDateType
}

export type PositionType = {
    lat: number
    lng: number
}

export type AddressType = {
    address: string
    position: PositionType
}

export type ResultsType = {
    addressesToRender: AddressType[]
    centrePoint: PositionType
}

export type OwnerType = {
    Email: string
    Do_Not_Mail: boolean
    Return_to_Sender: boolean
    Postal_Postcode: string
    Postal_State: string
    Postal_Address: string
    Postal_Suburb: string
    Name: string
    Contact_Type: string
    Company: string
    Mobile: string
    Work_Phone: string
    id: number
    Last_Mailed: string
    Last_Mailed_Date: string
}

export type UnprocessedResultsFromCRM = {
    [index: string]: string | number | OwnerType[] | string[]
    Latitude: string
    Longitude: string
    Deal_Name: string
    id: string
    distance: number | string
    owner_details: OwnerType[]
    Postcode: string
    State: string
    Property_Category_Mailing: string[]
    Managed: string
    Reversed_Geocoded_Address: string
    Property_Type_Portals: string
    Property_Contacts: string
    Property_Owners: string
    Land_Area_sqm: string
    Build_Area_sqm: string
    Sale_Type: string[]
    Sale_Date: string
    Sale_Price: string
}

export type ReactSelectOption = {
  value: string
  label: string
}

export type ReactSelectOptionEnum = {
    value: SaleTypeEnum
    label: SaleTypeEnum
  }
