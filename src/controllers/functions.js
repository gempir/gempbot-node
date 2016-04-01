var fs = require('fs');

function getNthWord(string, n)
{
    var words = string.split(" ");
    return words[n-1];
}

function isBroadcaster(channel, user)
{
	return isBroadcaster = channel.replace('#', '') == user.username;
}

function removeFromArray(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

function containsASCII(data)
{
    if (data.indexOf('▓') > -1 || data.indexOf('░') > -1) {
        return true;
    }
    return false;
}

function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

function getFilesizeInMegabytes(filepath)
{
	var stats = fs.statSync(filepath);
	var fileSizeInBytes = stats["size"];
	var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
 	return fileSizeInMegabytes;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFilesizeInKilobytes(filepath)
{
	var stats = fs.statSync(filepath);
	var fileSizeInBytes = stats["size"];
	var fileSizeInMegabytes = fileSizeInBytes / 1000.0;
 	return fileSizeInMegabytes;
}

function fileExists(filePath)
{
    if (fs.existsSync(filePath)){
        return true;
    }
    return false;
}

function secsToTime(sec_num)
{
    sec_num     = Math.round(sec_num);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

function lineCount(file)
{
    filePath = process.argv[2];
    fileBuffer =  fs.readFileSync(file);
    to_string = fileBuffer.toString();
    split_lines = to_string.split("\n");
    var lineCount = split_lines.length-1;
    return lineCount;
}

function countWords(str) {
  return str.split(/\s+/).length;
}

function stringContainsUrl(inputString)
{
    if (inputString.match(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
        return true;
    }
    return false;
}

function numberFormatted(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function stringIsLongerThan(inputString, lengthToCheck)
{
    if (inputString.length > lengthToCheck) {
        return true;
    }
    return false;
}

module.exports =
{
    getNthWord,
    getFilesizeInKilobytes,
    getFilesizeInMegabytes,
    isBroadcaster,
    stringContainsUrl,
    stringIsLongerThan,
    fileExists,
    numberFormatted,
    secsToTime,
    getRandomInt,
    countWords,
    containsASCII,
    removeFromArray,
    countProperties
};
