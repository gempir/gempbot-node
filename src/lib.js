function removeFromArray(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }
    return count;
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
    var time    = `${hours}:${minutes}:${seconds}`;
    return time;
}

function numberFormatted(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports =
{
    numberFormatted,
    secsToTime,
    removeFromArray,
    countProperties
};
