offline_map_poc
===============
Proof of concept for offline mobile mapping with PhoneGap, Leaflet, and MapBox.

Demo Android app available for download [here](https://build.phonegap.com/apps/311874/share)

##Usage
Simply enter a MapBox map id (looks like __example.map-asd23rds___) or several
(separated by a comma) and click the "Download Tiles" button.  You can click
"Clear Tiles" to clear the tiles.

##Code Architecture
 * tileUtils.js - functions for getting tile URLs for an area
 * fileUtils.js - functions for downloading a bunch of files to the local
 filesystem (and displaying a nice modal progress bar)
 * main.js - some UI and bookkeeping code

##Extending this code
This project is solely intended to be a proof of concept.  The guts  

##Gotchas
 * Domain whitelisting in config.xml - make sure you can access MapBox servers