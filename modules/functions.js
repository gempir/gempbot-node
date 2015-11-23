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
    if (!needle || !haystack) {
        return false;
    }
    else {
        var words = haystack.split(needle),
            count = {};
        for (var i = 0, len = words.length; i < len; i++) {
            if (count.hasOwnProperty(words[i])) {
                count[words[i]] = parseInt(count[words[i]], 10) + 1;
            }
            else {
                count[words[i]] = 1;
            }
        }
        return count;
    }
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
