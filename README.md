PhoneGap + MapBox + Leaflet: Offline Mapping Proof of Concept
===============
Demo Android app available for download [here](https://build.phonegap.com/apps/311874/share)

<img style="height:3.5in;margin-right:0.5in;"
src="http://silviaterra.github.com/offline_map_poc/download.png" />
<img style="height:3.5in;"
src="http://silviaterra.github.com/offline_map_poc/main.png" />

##Usage
Simply enter a MapBox map id (looks like *example.map-asd23rds*) or several
(separated by a comma) and click the "Download Tiles" button.  You can click
"Clear Tiles" to clear the tiles.

##Problem & Approach
I built this app because I needed a way to do offline mapping in a PhoneGap app.
Scott Davis had put together [a solution](http://geospatialscott.blogspot.com/2012/04/phonegap-leaflet-tilemill-offline.html)
that used PhoneGap, MapBox (TileMill+mbTiles), and Leaflet, but this requires the
SQLite plugin for PhoneGap.  

Because PhoneGap Build doesn't support that plugin yet, I thought I'd
try the brute-force strategy of downloading the raw tiles from the
[MapBox API](http://mapbox.com/developers/api/), saving them locally
through the [PhoneGap File API](http://docs.phonegap.com/en/2.3.0/cordova_file_file.md.html#File)
and then pointing a [Leaflet TileLayer](http://leafletjs.com/reference.html#tilelayer)
at the directory.

This isn't the ideal solution, of course, because there are a lot of advantages
to using mbTiles (highly compressed storage is the big one).  However, I
didn't want to give up PhoneGap Build... so I gave this a shot.  And it works!

Here is the order of operations:

 * The user specifies some MapBox map ids and presses "Download"
 * tiles.js calculates the tile URLs for the pyramid of tiles
 centered on the default lat/lng of Louisville, KY (home, sweet home)
 * files.js downloads all those tiles to a local directory
    * tiles/{map_id}/{z}/{x}/{y}.png
 * map.js points Leaflet at the appropriate directories, initializes a layer
    chooser, and displays the map
    
This is my first contribution to open source software and I hope this code is
helpful to you.  I certainly learned a lot making it!

##Code Structure
 * libs/ - 3rd party libraries
 * utils/ - core JS code for doing offline mapping
    * file.js - download/delete many files at once
    * tile.js - get tile URLs for an area
    * map.js - point Leaflet at the correct tiles and display map
 * config.xml - configuration details for PhoneGap Build
 * index.html - PhoneGap opens this page.  Just a map and some UI elements
 * main.js - some UI and bookkeeping code for this particular proof of concept
 

##Extending this code
This project is solely intended to be a proof of concept.  The core utilities
are in the utils directory - most of the functions are documented and should
be fairly straightforward to understand.

To actually make a mobile "app" out of this code, simply fork this project,
create a [PhoneGap Build](http://build.phonegap.com/) account and then
tell PhoneGap Build to pull from your git repo.  

A few "gotchas" to look out for:

 * Domain whitelisting in config.xml - make sure you allow access to MapBox servers
 * You have to sign up for a MapBox Basic account ($5/month) to have access to the
   satellite map tiles API.  Terrain and streets should be free though.
