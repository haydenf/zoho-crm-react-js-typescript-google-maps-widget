// TODO - tsconfig replace CommonJS with esnext
import { SalesEvidenceFilterParams, SaleTypeEnum, UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType } from '../types'

import { results } from './zohoReturned'

// * Filtering inputs
// Land Area - Land_Area_sqm - 500-2000 - 6 records
// Build Area - Build_Area_sqm - 1600-2500 - 4
// Date Sold - Sale_Date - 2000-06-07-2019-09-09 - 4
// Sale Price - Sale_Price - 425000-2000000 - 3
// Sale Type - Sale_Type - ['INV', 'VP', 'DEV'] - 8

function genericFilter (property: UnprocessedResultsFromCRM, filterType: string, filterValues: MinMaxNumberType | any) {
    return typeof property[filterType] === 'number' && (property[filterType] >= filterValues.min || property[filterType] <= filterValues.max)
}

function formatDateToString (date: Date): string {
    const dateYear = date.getFullYear()
    let dateMonth: string | number = date.getMonth() + 1
    let dateDate: string | number = date.getDate()
    const numberToLeftPadZero = 9
    if (dateMonth <= numberToLeftPadZero) dateMonth = `0${dateMonth}`
    if (dateDate <= numberToLeftPadZero) dateDate = `0${dateDate}`
    return `${dateYear}-${dateMonth}-${dateDate}`
}

function dateFilter (property: UnprocessedResultsFromCRM, dateSold: MinMaxDateType): boolean {
    const minDate = formatDateToString(dateSold.min)
    const maxDate = formatDateToString(dateSold.max)
    return typeof property.Sale_Date === 'string' && (property.Sale_Date >= minDate || property.Sale_Date <= maxDate)
}

function saleTypeFilter (property: UnprocessedResultsFromCRM, saleTypes: SaleTypeEnum[]): boolean {
    return saleTypes.some((saleType: SaleTypeEnum) => {
        return property.Sale_Type.includes(saleType)
    })
}
// for now I'll just use the array of property objects, but it'll probably be passing the property objects in one at a time when I include it into the sortAndFilterResults function
function salesEvidenceSortAndFilter (sortedAndFilteredResults: UnprocessedResultsFromCRM[], filterParameters: SalesEvidenceFilterParams) {
    console.log('sortedAndFilteredResults', sortedAndFilteredResults.length)

    const {
        landArea,
        buildArea,
        salePrice,
        saleType,
        dateSold
    } = filterParameters
    const filteredResults: UnprocessedResultsFromCRM[] = []
    sortedAndFilteredResults.some((property: UnprocessedResultsFromCRM) => {
        const isInLandAreaRange = genericFilter(property, 'Land_Area_sqm', landArea)
        const isInBuildAreaRange = genericFilter(property, 'Build_Area_sqm', buildArea)
        const isInSalePriceRange = genericFilter(property, 'Sale_Price', salePrice)
        // there may be multipe values in the saleType array, does that mean the user should be able to select multiple values?
        const isInSaleType = saleTypeFilter(property, saleType)
        const isInSaleDateRange = dateFilter(property, dateSold)
        if (isInLandAreaRange || isInBuildAreaRange || isInSalePriceRange || isInSaleType || isInSaleDateRange) filteredResults.push(property)
    })
    return filteredResults
}

const minDate = new Date()
minDate.setDate(minDate.getDate() - 7000)
const maxDate = new Date()

const filterParams = { landArea: { min: 1800, max: 2000 }, buildArea: { min: 2400, max: 2500 }, dateSold: { min: minDate, max: maxDate }, salePrice: { min: 425000, max: 2000000 }, saleType: [SaleTypeEnum.INV, SaleTypeEnum.VP, SaleTypeEnum.DEV] }

const sorted = salesEvidenceSortAndFilter(results, filterParams)

console.log('results from salesEvidence filter', sorted.length)
