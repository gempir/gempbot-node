var fs = require('graceful-fs')

function getNthWord(string, n) {
    var words = string.split(" ");
    return words[n-1];
}

function isBroadcaster(channel, user) {
	return isBroadcaster = channel.replace('#', '') == user.username;
}

function getFilesizeInMegabytes(filepath) {
	var stats = fs.statSync(filepath);
	var fileSizeInBytes = stats["size"];
	var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
 	return fileSizeInMegabytes;
}

function getFilesizeInKilobytes(filepath) {
	var stats = fs.statSync(filepath);
	var fileSizeInBytes = stats["size"];
	var fileSizeInMegabytes = fileSizeInBytes / 1000.0;
 	return fileSizeInMegabytes;
}

function fileExists(filePath) {
    if (fs.existsSync(filePath)){
        return true;
    }
    return false;
}

function stringContainsUrl(inputString) {
    if (inputString.indexOf(".") > -1) {
        return true;
    }
    if (inputString.indexOf("dot com") > -1) {
        return true;
    }
    if (inputString.indexOf(". com ") > -1) {
        return true;
    }
    return false;
}

function stringIsLongerThan(inputString, lengthToCheck) {
    if (inputString.length > lengthToCheck) {
        return true;
    }
    return false;
}

function occurrences(haystack, needle) {
    var count = 0;
    var position = 0;
    while(true) {
        position = haystack.indexOf(needle, position);
        if(position != -1) {
        count++;
        position += needle.length;
    } 
    else{
      break;
    }
  }
  return count;
}

module.exports = { 
    getNthWord, 
    getFilesizeInKilobytes,
    getFilesizeInMegabytes,
    isBroadcaster,
    occurrences,
    stringContainsUrl, 
    stringIsLongerThan,
    fileExists
};
