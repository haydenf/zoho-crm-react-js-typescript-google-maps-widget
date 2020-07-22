import React from 'react'
import { UnprocessedResultsFromCRM, OwnerType } from '../types'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
export function DownloadMailingListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    const matchingPropertiesAndOwners = props.results
    function generateCSVRow (propertyObject: UnprocessedResultsFromCRM) {
        let csvRow = ''
        let doNotMail
        let returnToSender
        let postalAddress
        let email
        const propertyAddress = propertyObject.Deal_Name
        const ownerDetails = propertyObject.owner_details
        const contact: OwnerType = ownerDetails[0]
        const owner: OwnerType = ownerDetails[1]

        if (!contact && owner) {
            doNotMail = owner.Do_Not_Mail
            returnToSender = owner.Return_to_Sender
            postalAddress = owner.Postal_Address
            email = owner.Email
        } else if (contact) {
            doNotMail = contact.Do_Not_Mail
            returnToSender = contact.Return_to_Sender
            postalAddress = contact.Postal_Address
            email = contact.Email
        }
        if (!doNotMail || !returnToSender || !email) {
            // const checker = null || undefined
            if (propertyAddress && postalAddress) {
                const ownerOrContact = owner ? (contact.Postal_Address ? contact : owner) : contact
                const ownerContactDupeRemoval = []
                ownerContactDupeRemoval.push(`${ownerOrContact.Postal_Address}-${ownerOrContact.Name}`)
                const isDupe = ownerContactDupeRemoval.includes(`${ownerOrContact.Postal_Address}-${ownerOrContact.Name}`)
                if (isDupe) {
                    const lastMailed = owner?.Last_Mailed || contact?.Last_Mailed || 'Last mailed has not been found'
                    csvRow = `"${ownerOrContact?.Name}","${ownerOrContact?.Contact_Type}","${ownerOrContact?.Postal_Suburb}","${ownerOrContact?.Postal_State}","${ownerOrContact?.Postal_Postcode}","${propertyAddress}", "${lastMailed}"\r\n`
                    csvRow = csvRow.replace(/null/g, '-')
                }
            }
        }
        return csvRow
    }
    const HEADER_ROW = '"Contact Name","Contact Type","Mailing Street Address","Mailing Suburb","Mailing State","Mailing Postcode","Property Address","Property Type (Marketing)","Company", "Last Mailed"\r\n'
    const csvRows = matchingPropertiesAndOwners.map(generateCSVRow).join('')
    const csvData = `${HEADER_ROW}${csvRows}`
    console.log(csvData.length, 'thuis is csvData')
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="mailinglist.csv" >Download Mailing List</a>)
}
