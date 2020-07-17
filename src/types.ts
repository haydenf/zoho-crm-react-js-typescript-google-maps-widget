export type SearchParametersType = BaseSearchParamsType & LeaseEvidenceFilterParams

type BaseSearchParamsType = {
  searchAddress: string
  propertyTypes: string[]
  propertyGroups: string[]
  neighboursSearchMaxRecords: number
  propertyGroupsMaxResults: number
  propertyTypesMaxResults: number
  managed: string[]
  id: string
}

const DEFAULT_LEASES_EVIDENCE_PARAMS = {
    landArea: {
        min: -1,
        max: -1
    },
    buildArea: {
        min: -1,
        max: -1
    },
    rentGross: {
        min: -1,
        max: -1
    },
    rentDollarMeter: {
        min: -1,
        max: -1
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

const DEFAULT_SALES_EVIDENCE_PARAMS = {
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
    rentPerDollarMeter: {
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
    propertyGroupsMaxResults: 200,
    propertyTypesMaxResults: 200,
    neighboursSearchMaxRecords: 100,
    propertyTypes: ['All'],
    propertyGroups: ['All'],
    managed: ['None'],
    readyForSearch: false,
    id: `search:${(Math.random() * 1000)}`,
    ...DEFAULT_SALES_EVIDENCE_PARAMS,
    ...DEFAULT_LEASES_EVIDENCE_PARAMS
}

export type LeaseEvidenceFilterParams = {
  landArea: MinMaxNumberType
  buildArea: MinMaxNumberType
  rentGross: MinMaxNumberType
  rentPerDollarMeter: MinMaxNumberType
  leasedDate: MinMaxDateType
  reviewDate: MinMaxDateType
}

export type MinMaxNumberType = {
  min: number
  max: number
}

export type MinMaxDateType = {
  min: Date
  max: Date
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
}

export type ReactSelectOption = {
  value: string
  label: string
}
