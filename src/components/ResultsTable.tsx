import React from 'react'

import { UnprocessedResultsFromCRM } from '../types'

type ResultsTableProps = {
    results: UnprocessedResultsFromCRM[]
    filterInUse: string
}

export function ResultsTableWidget (props: ResultsTableProps) {
    return (
        <div>
            {props.filterInUse === 'BaseFilter' &&
             (
                 <div style={{ padding: '20px' }}>
                     <table>
                         <thead>
                             <tr>
                                 <th>No.</th>
                                 <th>Property Address</th>
                                 <th>Owner</th>
                                 <th>Contact</th>
                             </tr>
                         </thead>
                         <tbody>
                             {props.results.map((result, index) => {
                                 let propertyAddress = result.Deal_Name
                                 if (!result.Latitude || !result.Longitude) {
                                     propertyAddress = `${result.Deal_Name} - Geocordinates N/A, cannot display on map.`
                                 }
                                 const ownerData = result.owner_details.find((owner) => owner.Contact_Type === 'Owner')
                                 const contactData = result.owner_details.find((owner) => owner.Contact_Type === 'Director')
                                 return (
                                     <tr key={`${result.id}-${index}`}>
                                         <td>{index + 1}</td>
                                         <td>{propertyAddress}</td>
                                         <td>{ownerData?.Name || ''}</td>
                                         <td>{contactData?.Name || 'Contact Is Not Found'}</td>
                                     </tr>
                                 )
                             })}
                         </tbody>
                     </table>
                 </div>
             )
            }
            {props.filterInUse === 'SalesEvidenceFilter' &&
             (
                 <div style={{ padding: '20px' }}>
                     <table>
                         <thead>
                             <tr>
                                 <th>No.</th>
                                 <th>Address</th>
                                 <th>Land Area</th>
                                 <th>Build Area</th>
                                 <th>Date Sold</th>
                                 <th>Sale Price</th>
                             </tr>
                         </thead>
                         <tbody>
                             {props.results.map((result, index) => {
                                 const propertyAddress = result.Deal_Name
                                 const landArea = result.Land_Area_sqm
                                 const buildArea = result.Build_Area_sqm
                                 const dateSold = result.Sale_Date
                                 const salePrice = result.Sale_Price
                                 return (
                                     <tr key={`${result.id}-${index}`}>
                                         <td>{index + 1}</td>
                                         <td>{propertyAddress}</td>
                                         <td>{landArea}</td>
                                         <td>{buildArea}</td>
                                         <td>{dateSold}</td>
                                         <td>{salePrice}</td>
                                     </tr>
                                 )
                             })}
                         </tbody>
                     </table>
                 </div>
             )
            }
        </div>
    )
}
