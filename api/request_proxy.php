<?php
/**
 * This script handles requests for elevation, weather, and traffic data.
 * CORS/localhost :: Server side API to be used as proxy to 3td party data. 
 * 
 * It receives a request type via the $_GET superglobal variable, and based on the
 * type of request it performs the necessary API calls and returns the corresponding data
 * in JSON format.
 * 
 * - For the elevation request, it sends a request to the OpenTopoData API to get the
 *   elevation data for a given latitude and longitude.
 */

if (!isset($_GET['request_type'])) {
    echo 'No request type specified.';
    exit();
}

$requestType = $_GET['request_type'];
$responseData = '';

switch ($requestType) {
    case 'elevation':

        if (isset($_GET['points'])) {
            $points = $_GET['points'];
         

            // Response object structure
            // Max 100 loc/r. 
            // Max 1 r/s. 
            // Max 1000 r/d.
            /* Object from: api.opentopodata.org/v1/
            {
                "results": [
                    {
                    "dataset": "eudem25m",
                    "elevation": 1781.7091064453125,
                    "location": {
                        "lat": 43.174251672,
                        "lng": 19.080044199
                    }
                    }
                ],
                "status": "OK"
            }
            */
            // If the raster has an integer data type, the interpolated elevation 
            // will be rounded to the nearest integer. This is a limitation of rasterio/gdal.
            // If the request location isn't covered by any raster in the dataset, 

            // Dataset name	Resolution	Extent	Source	API link (Denver, CO)
            // nzdem8m	    8 m	     New Zealand.	                                LINZ	Not in dataset bounds
            // ned10m	    ~10 m	 Continental USA, Hawaii, parts of Alaska.	    USGS	1590 m
            // eudem25m	    25 m	 Europe.	                                    EEA	    Not in dataset bounds
            // mapzen	    ~30 m	 Global, inluding bathymetry.	                Mapzen	1590 m
            // aster30m	    ~30 m	 Global.	                                    NASA	1591 m
            // srtm30m	    ~30 m	 Latitudes -60 to 60.	                        USGS	1604 m
            // srtm90m	    ~90 m	 Latitudes -60 to 60.	                        USGS	1603 m
            // bkg200m	    200 m	 Germany.	                                    BKG	    Not in dataset bounds
            // etopo1	    ~1.8 km	 Global, in. bathym. & ice surf. elev. poles.	NOAA	1596 m
            // gebco2020	~450m	 Global bathymetry and land elevation.	        GEBCO	1603 m
            // emod2018	    ~100m	 Bathymetry for ocean and sea in Europe.	    EMODnet	Not in dataset bounds
            
            // Open Topo Data will return null. https://www.opentopodata.org/api/
            $interpolation = 'interpolation=cubic';

            // Request elevation from OpenTopoData API
            $url = "https://api.opentopodata.org/v1/eudem25m?locations=$points&$interpolation";

            $elevation = '';
            try {
                $response = @file_get_contents($url);
                $headers = @get_headers($url);

                if ($response === false || $headers === false) {
                    throw new Exception("Error Sending Request", 1);
                } else {
                    $status = substr($headers[0], 9, 3);
                    if ($status === '200') {
                        // request succeeded, do something with $response
                    } else {
                        // request failed with status $status
                    }
                }
                $json = json_decode($response);
                $elevation = $json->results;
            } catch (\Throwable $th) {
                if ($th->getCode() == 429) {
                    // Log 429 error
                    $$elevation = ['result' => 'Error code 429'];
                }
            }

            $responseData = ['result' => $elevation];

        } else {
            $responseData = ['error' => 'Latitude and/or longitude not provided.'];
        }
        break;

    case 'trails':
        // Path to your JSON file
        
        $json_file = './data/trailsDataGPS.json';

        if(isset($_GET['clear']))
        {
            opcache_invalidate('./data/trailsDataGPS.json', false);
        } 

        // Check if file exists
        if (file_exists($json_file)) {
            
            $trailsData = file_get_contents($json_file);
            $trailsData = str_replace("\r\n", "\n", $trailsData);

            $responseData = ['result' => $trailsData];
        } else {
            $error = array('error' => 'File not found.');
            $responseData = $error;
        }
        break;

    case 'traffic':
        // handle traffic request
        break;
        
    default:
        echo 'Invalid request type specified.';
        exit();
}

header('Content-Type: application/json');
echo json_encode($responseData);
?>