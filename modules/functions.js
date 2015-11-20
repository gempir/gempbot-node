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

function occurrences(string, subString, allowOverlapping) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

module.exports = { getNthWord, getFilesizeInKilobytes, getFilesizeInMegabytes, isBroadcaster, occurrences };
