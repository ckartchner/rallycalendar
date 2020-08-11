const calendar_api = "https://api.wrc.com/contel-page/83388/calendar/active-season/";
const locale = window.navigator.languages;

function parseDate(dateString) {
  console.log(dateString);
  const dateParts = dateString.split('-');
  const year = dateParts[0];
  const month = dateParts[1] - 1;
  const day = dateParts[2];
  const formatOptions = {weekday: 'short', day: 'numeric', month: 'short'};
  const dateObj = new Date(year, month, day);
  // Handle locales not usable by toLocaleDateString
  let formattedDate = 'undefined';
  try {
    formattedDate = dateObj.toLocaleDateString(locale, formatOptions);
  } catch(err) {
    try{
      formattedDate = dateObj.toLocaleDateString(locale[0], formatOptions);
    } catch{
      // if all else fails default to en-us locale
      formattedDate = dateObj.toLocaleDateString('en-us', formatOptions);
    }
  }
  console.log(`Formatted date: ${formattedDate}`)
  return formattedDate;
}
function parseCal(data) {
  let events = []
  data.rallyEvents.items.forEach(event => {
    eventDays = event.eventDays
    startDate = parseDate(eventDays[0]['eventDay']);
    endDate = parseDate(eventDays[eventDays.length - 1]['eventDay']);
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
