var fs = require('graceful-fs')

function getNthWord(string, n)
{
    var words = string.split(" ");
    return words[n-1];
}

function isBroadcaster(channel, user)
{
	return isBroadcaster = channel.replace('#', '') == user.username;
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


function stringContainsUrl(inputString)
{
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

function logStats(file, username) 
{
    var fileBuffer =  fs.readFileSync(file);
    var to_string = fileBuffer.toString();
    var split_lines = to_string.split("\n");
    split_lines.pop();
    var lineCount = split_lines.length;
    var messageLength = 0;
    var wordCount = 0;

    for (var i = 0, len = split_lines.length; i < len; i++) {
        messageAndUsernameOnly = split_lines[i].split(']');
        if (typeof messageAndUsernameOnly[1] !== 'undefined') {
            messageOnly = messageAndUsernameOnly[1].split(username + ':');
            messageLength += messageOnly[1].length;
            messageSplit = messageOnly[1].split(' ');
            wordCount += messageSplit.length;
        }
    }
    var avgMessageLength = messageLength / lineCount;
    var avgWords = wordCount / lineCount;
    avgMessageLength = avgMessageLength.toFixed(0);
    avgWords = avgWords.toFixed(1);

    return ' average message has ' + avgMessageLength + ' characters and ' + avgWords + ' words, and he/she spammed a total of ' + lineCount + ' lines';
}

function occurrences(haystack, needle)
{
    var count = 0;
    var position = 0;
    while(true) {
        position = haystack.indexOf(needle, position);
        if( position != -1) {
            count++;
            position += needle.length;
        } 
    else{
      break;
    }
  }
  return count;
}

module.exports = 
{ 
    getNthWord, 
    getFilesizeInKilobytes,
    getFilesizeInMegabytes,
    isBroadcaster,
    occurrences,
    stringContainsUrl, 
    stringIsLongerThan,
    fileExists,
    numberFormatted,
    secsToTime,
    getRandomInt,
    logStats
};
