// TODO - tsconfig replace CommonJS with esnext
import { SalesEvidenceFilterParams, SaleTypeEnum, UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType } from '../types'

function genericFilter (property: UnprocessedResultsFromCRM, filterType: string, filterValues: MinMaxNumberType | any) {
    return typeof property[filterType] === 'number' && property[filterType] >= filterValues.min && property[filterType] <= filterValues.max
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
    return typeof property.Sale_Date === 'string' && property.Sale_Date >= minDate && property.Sale_Date <= maxDate
}

function saleTypeFilter (property: UnprocessedResultsFromCRM, saleTypes: SaleTypeEnum[]): boolean {
    return saleTypes.some((saleType: SaleTypeEnum) => {
        return property.Sale_Type.includes(saleType)
    })
}

export default function salesEvidenceFilter (property: UnprocessedResultsFromCRM, filterParameters: SalesEvidenceFilterParams): boolean {
    const {
        landArea,
        buildArea,
        salePrice,
        saleType,
        dateSold
    } = filterParameters
    const isInLandAreaRange = genericFilter(property, 'Land_Area_sqm', landArea)
    const isInBuildAreaRange = genericFilter(property, 'Build_Area_sqm', buildArea)
    const isInSalePriceRange = genericFilter(property, 'Sale_Price', salePrice)
    const isInSaleType = saleTypeFilter(property, saleType)
    const isInSaleDateRange = dateFilter(property, dateSold)
    // USING && logic but also if no value is entered it is skipped
    return isInLandAreaRange || isInBuildAreaRange || isInSalePriceRange || isInSaleType || isInSaleDateRange
}
