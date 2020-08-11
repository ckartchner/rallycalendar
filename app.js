const calendar_api = "https://api.wrc.com/contel-page/83388/calendar/active-season/";
const locale = window.navigator.languages;

function parseDate(dateString) {
  const dateParts = dateString.split('-');
  const year = dateParts[0];
  const month = dateParts[1] - 1;
  const day = dateParts[2];
  const rawDateObj = new Date(year, month, day);
  return rawDateObj;
}

function formatDate(dateObj) {
  let formattedDate = 'undefined';
  const formatOptions = {weekday: 'short', day: 'numeric', month: 'short'};
  // Handle locales not usable by toLocaleDateString
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
  return formattedDate
}

function parseCal(data) {
  let events = []
  data.rallyEvents.items.forEach(event => {
    eventDays = event.eventDays
    rawStartDate = parseDate(eventDays[0]['eventDay']);
    rawEndDate = parseDate(eventDays[eventDays.length - 1]['eventDay']);
    startDate = formatDate(rawStartDate);
    endDate = formatDate(rawEndDate);
    eventInfo = `https://www.wrc.com${event.pageInfo['url']}`
    events.push({'name': event.name, 'startDate': startDate, 'endDate': endDate, 
                 'eventInfo': eventInfo, 'rawStartDate': rawStartDate, 
                 'rawEndDate': rawEndDate});
  })
  // Set event status
  current_date = new Date()
  next_event_index = undefined;
  next_event_diff = new Date(current_date.getFullYear() + 5, 0) - current_date;
  for (let i = 0; i < events.length; i++) {
    event = events[i]
    if (event.rawEndDate < current_date) {
      events[i].status = 'past';
    } else if (event.rawStartDate > current_date) {
      events[i].status = 'future';
    } else if (event.rawStartDate <= current_date && event.rawEndDate >= current_date) {
      event[i].status = 'active';
    } else {
      event[i].status = 'unknown';
    }
    time_till_event = event.rawEndDate - current_date
    if (time_till_event < next_event_diff && time_till_event > 0) {
      next_event_index = i;
      next_event_diff = time_till_event;
    }
  }
  if (next_event_index !== 'undefined') {
    events[next_event_index].status = 'next';
  }
  return events;
}

let eventTable = new Vue({
  el: '#vue-scope',
  data: {
    events: null,
    year: null,
  },
  async created() {
    const response = await fetch(calendar_api);
    const data = await response.json();
    this.year = data.seasonYear;
    this.events = parseCal(data);
    // TODO: Handle API unavailable
  }
});
