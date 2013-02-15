function bulkDownload(urls, targetDir, progressModal, callback) {
  /*
   * Bulk download of urls to the targetDir (relative path from root) 
   */
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT, 0, 
    function(fileSystem) { //success
        var rootDir = fileSystem.root.fullPath;
        if (rootDir[rootDir.length-1] != '/') { rootDir += '/'; }
        var tilesDir = rootDir + targetDir;
        
        //show progress modal
        var progressBar = progressModal.find(".bar");
        progressBar.css('width', '0%');
        progressModal.modal('show');
        downloadTile(urls, 0, tilesDir, progressModal, progressBar, callback);
    },
    function() { alert("Failure!"); } //filesystem failure
  );    
}

function downloadTile(urls, index, tilesDir, progressModal, progressBar, callback) {
    if (index >= urls.length) { //callback if done
        progressModal.modal('hide');
        callback(); 
        return; 
    } 
    
    //update modal progress
    var dl_precent = index * 100.0 / urls.length; 
    progressBar.css('width', dl_percent + '%');
    
    var url = urls[index];
    //all urls start with: http://api.tiles.mapbox.com/v3/ - length 31
    var tail = url.slice(31); //something like ex.map-1234saf/15/8580/12610.png
    
    var fn = tilesDir + '/' + tail;
  
    var fileTransfer = new FileTransfer();
    fileTransfer.download(url, fn,
        function(theFile) { downloadTile(urls, index+1, tilesDir, callback); },
        function(error) { alert("download error code: " + error.code); }
    );    
}
