//sloppy globals but ok for now
var MAP;
var MAP_CONTROL;
var BASE_LAYERS = {};
var FILESYSTEM;

function clearTiles(callback) {
    FILESYSTEM.root.getDirectory('tiles', {create: true},
        function(dir) { //success
           dir.removeRecursively(
                function() { callback(); }, 
                function(){ alert("Error deleting!"); }
            );
        }, 
        function() { alert("Error deleting tiles")} //fail
    );
}

function tileFormat4FS(fileSystem, mapID) {
    var rootDir = fileSystem.root.fullPath;
    if (rootDir[rootDir.length-1] != '/') { rootDir += '/'; }
    return rootDir + 'tiles/' + mapID + '/{z}/{x}/{y}.png';
}

function getMapIDs() {
    /*
     * Return a list of mapIDs or null 
     */
    var mapboxIDs = (localStorage["MAPBOX_IDS"] || "").split(",");
    if (mapboxIDs == [""]) { return null; } //no ids
    else { return mapboxIDs; }
}

function reloadMap(options) {
    /*
     * Clear layers and reset based
     * on current mapIDs
     */
     
    //handle options
    var clear = options['clear'] || false;

    if (!MAP) { //initialize map if first time
        MAP = L.map('map', {'minZoom': 3, 'maxZoom': 17}).setView([38.255, -85.73], 15);
    }
    
    //clear out old MAP_CONTROL
    if (MAP_CONTROL) { MAP.removeControl(MAP_CONTROL); MAP_CONTROL=null; }

    //clear out old layers
    for (mapID in BASE_LAYERS) {
        var lyr = BASE_LAYERS[mapID];
        lyr.redraw(); //clear tiles
        MAP.removeLayer(lyr);
    }
    BASE_LAYERS = {};
    
    if (clear) { return; } //job done if just clear
    
    var mapboxIDs = getMapIDs();
    if (mapboxIDs == null) { return; } //no ids
    
    //add a layer for each mapbox ID
    for (var i=0, l=mapboxIDs.length; i<l; i++) {
        var mapID = mapboxIDs[i];
        var format = tileFormat4FS(FILESYSTEM, mapID);
        var lyr = L.tileLayer(format, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; MapBox',
            minZoom: 3,
            maxZoom: 17
        })
        BASE_LAYERS[mapID] = lyr;
        lyr.addTo(MAP); 
    }
    
    MAP_CONTROL = L.control.layers(BASE_LAYERS, {});
    MAP_CONTROL.addTo(MAP);
}

$(document).ready(function() {
    //Some bookkeeping code for mapbox id
    $("#mapbox_id")
    .val(localStorage["MAPBOX_IDS"])
    .off("change")
    .on("change", function() { localStorage["MAPBOX_IDS"] = $(this).val(); });

    //Real page setup on phonegap initialization
    $(document).off("deviceready").on("deviceready", function() {
    
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fs) { //success
                FILESYSTEM = fs; //set global - sloppy, I know
                reloadMap({'clear':false});
            },
            function() { alert("Failure!"); } //filesystem failure
        );
        
        $("#clear").off("click").on("click", function() {
            clearTiles(function(){ reloadMap({'clear':true}); alert("Tiles cleared successfully"); });
        });

        $("#download").off("click").on("click", function() {
            var mapboxIDs = getMapIDs();
            if (mapboxIDs == null) { alert("Enter a MapBox Map ID"); return; } //no ids
            bulkDownload(
               pyramid(mapboxIDs, 38.255, -85.73, {'minZoom':14, 'maxZoom':16}), //tile urls
               'tiles',
               $("#progress_modal"),
               function() { alert("Download successful!"); reloadMap({'clear':false}); }
            );
        });
    }); 
});
