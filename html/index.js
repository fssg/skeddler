const url = 'https://localhost:443/api';

/**
 * @typedef {'ACL' | 'BIND' | 'CHECKOUT' | 'CONNECT'
 *          | 'COPY' | 'DELETE' | 'GET' | 'HEAD'
 *          | 'LINK' | 'LOCK' | 'M-SEARCH' | 'MERGE'
 *          | 'MKACTIVITY' | 'MKCALENDAR' | 'MKCOL' | 'MOVE'
 *          | 'NOTIFY' | 'OPTIONS' | 'PATCH' | 'POST'
 *          | 'PROPFIND' | 'PROPPATCH' | 'PURGE' | 'PUT'
 *          | 'REBIND' | 'REPORT' | 'SEARCH' | 'SOURCE'
 *          | 'SUBSCRIBE' | 'TRACE' | 'UNBIND' | 'UNLINK' |
 *          'UNLOCK' | 'UNSUBSCRIBE'} HTTPRequestMethod
 */

const monday = 1;
const tuesday = 2;
const wednesday = 3;
const thursday = 4;
const friday = 5;
const saturday = 6;
const sunday = 7;

const activityTemplate = document.getElementById('activity-template');
const schedule = document.getElementById('schedule');
async function updateSchedule(day, slotIndex, activityId) {
    const reqUrl = `${url}/schedule/${day}/${slotIndex}`;
    console.log(reqUrl)
    fetch({
        /** @type {HTTPRequestMethod} */
        method: 'PATCH',
        url: reqUrl,
        body: parseInt(activityId)
    }).then(res => {
        console.log('Schedule updated successfully');
    });
}

document.getElementById('tcellmon').appendChild(
    activityTemplate.content.cloneNode(true)
);

updateSchedule(monday, 0, 0);