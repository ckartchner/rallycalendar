const calendar_api = "https://api.wrc.com/contel-page/83388/calendar/active-season/";

async function getUrl(url) {
    let response = await fetch(url);
    return response.json();
}


// let calData = getUrl(calendar_api);
console.log('we here');
// console.log(calData)
let events = [];

const getCalData = async () => {
  let calData = await getUrl(calendar_api);
  // console.log(calData)
  return calData;
}

function parseCal(data) {
  let events = []
  data.rallyEvents.items.forEach(event => {
    eventDays = event.eventDays
    startDate = eventDays[0]['eventDay']
    endDate = eventDays[eventDays.length - 1]['eventDay']
    eventInfo = `https://www.wrc.com${event.pageInfo['url']}`
    // events.push(`${event.name}: ${start_date} - ${end_date} ${eventInfo}`)
    events.push({'name': event.name, 'startDate': startDate, 'endDate': endDate})
  })
  return events;
}
// let calData = getCalData()
// console.log(calData);
// calData.rallyEvents.items.forEach(event => {
//   eventDays = event.eventDays
//   startDate = eventDays[0]['eventDay']
//   endDate = eventDays[eventDays.length - 1]['eventDay']
//   eventInfo = `https://www.wrc.com${event.pageInfo['url']}`
//   // events.push(`${event.name}: ${start_date} - ${end_date} ${eventInfo}`)
//   events.push({'name': event.name, 'startDate': startDate, 'endDate': endDate})
// })

let firstTable = new Vue({
  el: '#firstTable',
  data: {
    events: null
  },
  async created() {
    console.log('hi');
    const response = await fetch(calendar_api);
    const data = await response.json();
    this.events = parseCal(data);
  }
});

// let secondTable = new Vue({
//   el: '#secondTable',
//   data:
// });