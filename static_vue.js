const calendar_api = "https://api.wrc.com/contel-page/83388/calendar/active-season/";

function parseCal(data) {
  let events = []
  data.rallyEvents.items.forEach(event => {
    eventDays = event.eventDays
    startDate = eventDays[0]['eventDay']
    endDate = eventDays[eventDays.length - 1]['eventDay']
    eventInfo = `https://www.wrc.com${event.pageInfo['url']}`
    events.push({'name': event.name, 'startDate': startDate, 'endDate': endDate, 'eventInfo': eventInfo})
  })
  return events;
}

let firstTable = new Vue({
  el: '#firstTable',
  data: {
    events: null
  },
  async created() {
    const response = await fetch(calendar_api);
    const data = await response.json();
    this.events = parseCal(data);
    // TODO: Handle API unavailable
  }
});
