import React, { useState, useEffect } from 'react'
import './index.css'
import { SearchWidgetsWrapper } from './components/SearchWidgetsWrapper'
import { findMatchingRecords, getGoogleMapsAPIKeyFromCRM, getSearchAddressPosition } from './services/crmDataService'
import { MapWidget } from './components/MapWidget'
import { ResultsTableWidget } from './components/ResultsTable'
import { DownloadMailingListButton } from './components/DownloadMailingListButton'
import { DownloadContactListButton } from './components/DownloadContactListButton'
import DownloadSalesEvidenceListButton from './components/DownloadSalesEvidenceListButton'
import { UnprocessedResultsFromCRM, ResultsType, DEFAULT_SEARCH_PARAMS, PositionType, IntersectedSearchAndFilterParams } from './types'
import { UpdateLastMailedButton } from './components/UpdateLastMailedButton'
import { MassMailButton } from './components/MassMailButton'

function prepareDataForMap (results: UnprocessedResultsFromCRM[], searchAddressPosition: PositionType): ResultsType | undefined {
    if (!results || results.length === 0) {
        return undefined
    }

    if (!searchAddressPosition) {
        return undefined
    }

    return {
        centrePoint: {
            lat: searchAddressPosition.lat,
            lng: searchAddressPosition.lng
        },
        addressesToRender: results.map((result) => {
            return {
                address: result.Deal_Name,
                position: {
                    lat: parseFloat(result.Latitude),
                    lng: parseFloat(result.Longitude)
                }
            }
        })
    }
}

function renderResultsWidgets (results: UnprocessedResultsFromCRM[], googleMapsApiKey: string | undefined, isLoading: boolean, uniqueSearchRecords: number, searchAddressPosition: PositionType, filterInUse: string) {
    const dataForMap = prepareDataForMap(results, searchAddressPosition)
    if (results && dataForMap && googleMapsApiKey && !isLoading) {
        return (
            <div style={{ padding: '20px' }}>

                <div>
                    {filterInUse === 'BaseFilter' &&
                        (
                            <div style={{ padding: '20px' }}>
                                <div className="download-button-wrapper pagebreak">
                                    <DownloadContactListButton results={results} />
                                    <DownloadMailingListButton results={results} />
                                    <MassMailButton results={results} />
                                </div>
                                <UpdateLastMailedButton results={results} />
                            </div>
                        )
                    }
                    {filterInUse === 'SalesEvidenceFilter' &&
                        (
                            <div className="download-button-wrapper pagebreak">
                                <DownloadSalesEvidenceListButton results={results} />
                            </div>
                        )
                    }
                </div>
                <div className="pagebreak">
                    <MapWidget addressesToRender={dataForMap.addressesToRender} centrePoint={dataForMap.centrePoint} mapsApiKey={googleMapsApiKey} />
                </div>
                <div className="pagebreak">
                    <p>Unique Search Results: {uniqueSearchRecords}</p>
                    <ResultsTableWidget results={results} filterInUse={filterInUse} />
                </div>
            </div>
        )
    }
}

function App () {
    const [searchParameters, changeSearchParameters] = useState<IntersectedSearchAndFilterParams[]>([{ ...DEFAULT_SEARCH_PARAMS }])
    const [isReadyForSearch, setReadyForSearch] = useState<boolean>(false)
    const [results, updateResults] = useState<UnprocessedResultsFromCRM[]>([])
    const [googleMapsApiKey, updateGoogleMapsApiKey] = useState()
    const [isLoading, setLoading] = useState(false)
    const [uniqueSearchRecords, setUniqueSearchRecords] = useState<number>(0)
    const [searchAddressPosition, setSearchAddressPosition] = useState<PositionType>()
    const [filterInUse, setFilterInUse] = useState<string>('BaseFilter')

    useEffect(() => {
        if (isReadyForSearch) {
            const getDataFromCrm = async () => {
                setLoading(true)
                const { matchedProperties, uniqueSearchRecords } = await findMatchingRecords(searchParameters, filterInUse)
                const searchAddressPosition = await getSearchAddressPosition(searchParameters)
                setSearchAddressPosition(searchAddressPosition)
                setUniqueSearchRecords(uniqueSearchRecords.length)
                updateResults(matchedProperties)
                setLoading(false)
                setReadyForSearch(false)
            }

            void getDataFromCrm()
        }
    }, [searchParameters, isReadyForSearch, filterInUse])

    useEffect(() => {
        const getMapsAPIKeyFromCRM = async () => {
            const apiKey = await getGoogleMapsAPIKeyFromCRM()
            updateGoogleMapsApiKey(apiKey)
        }

        void getMapsAPIKeyFromCRM()
    }, [])

    return (
        <div className="App">
            <SearchWidgetsWrapper changeSearchParameters={changeSearchParameters} searchParameters={searchParameters} setReadyForSearch={setReadyForSearch} setFilterInUse={setFilterInUse} filterInUse={filterInUse}/>
            {isLoading &&
                <div style={{ padding: '20px' }}>
                    Loading ... estimated waiting time 20 seconds.
                </div>
            }
            {searchAddressPosition && renderResultsWidgets(results, googleMapsApiKey, isLoading, uniqueSearchRecords, searchAddressPosition, filterInUse)}
        </div>
    )
}

export default App
