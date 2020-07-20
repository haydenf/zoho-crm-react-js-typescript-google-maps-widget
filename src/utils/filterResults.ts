import { IntersectedSearchAndFilterParams, UnprocessedResultsFromCRM, OwnerType } from '../types'
import salesEvidenceFilter from './salesEvidenceFilter'

type MatchTallies = {
  [index: string]: number
  neighbour: number
  propertyType: number
  propertyGroup: number
}

function matchForPropertyTypes (property: UnprocessedResultsFromCRM, desiredPropertyTypes: string[]): boolean {
    return desiredPropertyTypes.some((propertyType: string) => {
        return (desiredPropertyTypes.includes('All') || property.Property_Category_Mailing.includes(propertyType))
    })
}

function matchForPropertyGroups (property: UnprocessedResultsFromCRM, desiredPropertyGroups: string[]): boolean {
    return desiredPropertyGroups.some((propertyGroup: string) => {
        return (desiredPropertyGroups.includes('All') || property.Property_Type_Portals.includes(propertyGroup))
    })
}

function getOwnerData (property: UnprocessedResultsFromCRM) {
    const ownerData: OwnerType[] = []

    const parsedPropertyContacts = !property.Property_Contacts ? [] : JSON.parse(property.Property_Contacts)
    parsedPropertyContacts.forEach((contact: OwnerType) => {
        contact.Contact_Type = 'Director'
        ownerData.push(contact)
    })

    const parsedPropertyOwners = !property.Property_Owners ? [] : JSON.parse(property.Property_Owners)

    parsedPropertyOwners.forEach((owner: OwnerType) => {
        owner.Contact_Type = 'Owner'
        ownerData.push(owner)
    })
    return ownerData
}

export default function filterResults (unsortedPropertyResults: UnprocessedResultsFromCRM[], searchParameters: IntersectedSearchAndFilterParams[], filterInUse: string): { matchedProperties: UnprocessedResultsFromCRM[], uniqueSearchRecords: string[] } {
    let desiredPropertyTypes = searchParameters[0].propertyTypes
    let desiredPropertyGroups = searchParameters[0].propertyGroups
    const managed = searchParameters[0].managed
    const isPropertyTypeFilterInUse = desiredPropertyTypes.length !== 0
    const isPropertyGroupFilterInUse = desiredPropertyGroups.length !== 0

    const maxNumNeighbours = searchParameters[0].neighboursSearchMaxRecords
    // Default - Infinity
    let maxResultsForPropertyTypes: number
    let maxResultsForPropertyGroups: number
    console.log('isPropertyTypeFilterInUse && isPropertyGroupFilterInUse', isPropertyTypeFilterInUse, desiredPropertyTypes, isPropertyGroupFilterInUse, desiredPropertyGroups)

    if (!isPropertyTypeFilterInUse && isPropertyGroupFilterInUse) {
        maxResultsForPropertyTypes = 0
        maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
    } else if (isPropertyTypeFilterInUse && !isPropertyGroupFilterInUse) {
        maxResultsForPropertyGroups = 0
        maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
    } else {
        maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
        desiredPropertyTypes = ['All']
        maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
        desiredPropertyGroups = ['All']
        console.log('desiredPropertyGroups', desiredPropertyGroups, desiredPropertyTypes)
    }

    // const maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults

    const matchTallies: MatchTallies = {
        neighbour: 0,
        propertyType: 0,
        propertyGroup: 0
    }
    const matchedProperties: UnprocessedResultsFromCRM[] = []
    const uniqueSearchRecords: string[] = []
    const lengthOfUnprocessedResults = unsortedPropertyResults.length
    console.log('lengthOfUnprocessedResults', lengthOfUnprocessedResults, managed)

    unsortedPropertyResults.forEach((property: UnprocessedResultsFromCRM) => {
        if (!property.Latitude || !property.Longitude) {
            return
        }
        const isUnderNeighbourLimit = matchTallies.neighbour < maxNumNeighbours
        const isUnderPropertyTypeLimit = matchTallies.propertyType < maxResultsForPropertyTypes
        const isUnderPropertyGroupLimit = matchTallies.propertyGroup < maxResultsForPropertyGroups
        let canAddAnotherProperty = isUnderNeighbourLimit || isUnderPropertyTypeLimit || isUnderPropertyGroupLimit
        console.log('isUnderPropertyGroupLimit, isUnderPropertyTypeLimit, isUnderNeighbourLimit', isUnderPropertyGroupLimit, isUnderPropertyTypeLimit, isUnderNeighbourLimit)

        if (filterInUse === 'SalesEvidenceFilter') {
            canAddAnotherProperty = canAddAnotherProperty && salesEvidenceFilter(property, searchParameters)
        }

        if (canAddAnotherProperty) {
            const propertyTypeMatch = isPropertyTypeFilterInUse && isUnderPropertyTypeLimit && matchForPropertyTypes(property, desiredPropertyTypes)
            const propertyGroupMatch = isPropertyGroupFilterInUse && isUnderPropertyGroupLimit && matchForPropertyGroups(property, desiredPropertyGroups)

            const ownerData = getOwnerData(property)
            const canAddBasedOnFilters = propertyGroupMatch || propertyTypeMatch
            const isManaged = (property.Managed === managed) || managed === 'All'
            const shouldAddProperty = isManaged && (canAddBasedOnFilters || isUnderNeighbourLimit)
            console.log('property.Managed === managed', property.Managed === managed, property.Managed)

            if (shouldAddProperty) {
                if (ownerData.length > 0) {
                    property.owner_details = ownerData
                }
                if (propertyTypeMatch) {
                    matchTallies.propertyType += 1
                }
                if (propertyGroupMatch) {
                    matchTallies.propertyGroup += 1
                }
                if (canAddBasedOnFilters && isUnderNeighbourLimit) {
                    matchTallies.neighbour += 1
                    console.log('property.Property_Type_Portals', property.Property_Type_Portals)

                    const isDupeId = uniqueSearchRecords.includes(property.id)
                    if (!isDupeId) {
                        // N. B. This is to remove dupes retrieved during the getPageOfRecords function.
                        uniqueSearchRecords.push(property.id)
                        matchedProperties.push(property)
                    }
                }
                // may need to remove this
                property.owner_details = ownerData
            }
        }
    })
    console.log('matchedProperties', lengthOfUnprocessedResults, matchedProperties.length, uniqueSearchRecords.length, matchTallies)

    return { matchedProperties, uniqueSearchRecords }
}
