
import React from 'react'
import { UnprocessedResultsFromCRM, OwnerType } from '../types'
import getUniqueListBy from '../utils/getUniqueListBy'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}

export function DownloadContactListButton (props: DownloadButtonProps) {
    const csvHeader = '"Property Address","Name","Owner/Contact","Mobile","Work Phone"\r\n'
    const arrayOfPropertyObjects = props.results

    const uniqueProperties = getUniqueListBy(arrayOfPropertyObjects, 'id')
    let type = 'unknown'
    const csvRows = uniqueProperties.map((result: UnprocessedResultsFromCRM) => {
        if (result.owner_details && Array.isArray(result.owner_details)) {
            const mobileNumbers = result.owner_details.map((owner: OwnerType) => owner.Mobile).filter((Mobile: string) => Mobile)
            const mobile = mobileNumbers.length > 0 ? mobileNumbers[0] : null
            const workPhones = result.owner_details.map((owner: OwnerType) => owner.Work_Phone).filter((Work_Phone: string) => Work_Phone)
            const workPhone = workPhones.length > 0 ? workPhones[0] : null
            const propertyAddress = result.Deal_Name
            const ownerDetails = result.owner_details
            const contact: OwnerType = ownerDetails[0]
            const owner: OwnerType = ownerDetails[1]

            if (owner) {
                type = 'Owner'
            } else if (contact) {
                type = 'Contact'
            }
            if (mobile || workPhone) {
                const newRow = `"${propertyAddress}","${owner?.Name || contact?.Name || ''}","${type || ''}" "${owner?.Mobile || contact?.Mobile || ''}","${owner?.Work_Phone || contact?.Work_Phone || ''}"\r\n`
                return newRow.replace(/null/g, '-')
            }
        }
        return null
    }).filter((row) => row).join('')

    const csvData = `${csvHeader}${csvRows}`
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )
    const downloadUrl = URL.createObjectURL(resultsBlob)
    return (<a href={downloadUrl} className="button" download="contactlist.csv" >Download Contact List</a>)
}
