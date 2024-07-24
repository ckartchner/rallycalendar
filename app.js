const currentDateTime = new Date();
const currentYear = currentDateTime.getFullYear();
const calendar_api = `https://api.wrc.com/content/filters/calendar?championship=wrc&origin=vcms&year=${currentYear}`;
const locale = window.navigator.languages;

function formatDate(dateObj) {
  dateObj = new Date(dateObj);
  const formatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  // Handle locales not usable by toLocaleDateString
  try {
    formattedDate = dateObj.toLocaleDateString(locale, formatOptions);
  } catch (err) {
    try {
      formattedDate = dateObj.toLocaleDateString(locale[0], formatOptions);
    } catch {
      // if all else fails default to en-us locale
      formattedDate = dateObj.toLocaleDateString("en-us", formatOptions);
    }
  }
  return formattedDate;
}

function parseCal(data) {
  let events = [];
  data.content.forEach((event) => {
    eventInfo = 'undefined';
    if (event.id !== null && event.seriesUid !== null){
      eventInfo = `https://www.wrc.com/c/event/${event.uid}_${event.seriesUid}`
    }
    events.push({
      name: event.title,
      startDate: formatDate(event.startDateLocal),
      endDate: formatDate(event.endDateLocal),
      rawStartDate: new Date(event.startDateLocal),
      rawEndDate: new Date(event.endDateLocal),
      eventInfo: eventInfo,
      description: event.description,
    });
  });
  // Set event status
  next_event_index = undefined;
  active_event = false;
  next_event_diff = new Date(currentDateTime.getFullYear() + 5, 0) - currentDateTime;
  for (let i = 0; i < events.length; i++) {
    event = events[i];
    if (event.rawEndDate < currentDateTime) {
      events[i].status = "past";
    } else if (event.rawStartDate > currentDateTime) {
      events[i].status = "future";
    } else if (
      event.rawStartDate <= currentDateTime &&
      event.rawEndDate >= currentDateTime
    ) {
      events[i].status = "active";
      active_event = true;
    } else {
      events[i].status = "unknown";
    }
    time_till_event = event.rawEndDate - currentDateTime;
    if (time_till_event < next_event_diff && time_till_event > 0) {
      next_event_index = i;
      next_event_diff = time_till_event;
    }
  }
  noIndexStates = ["undefined", undefined];
  if (
    noIndexStates.includes(next_event_index) === false &&
    active_event === false
  ) {
    events[next_event_index].status = "next";
  }
  return events;
}

let eventTable = new Vue({
  el: "#vue-scope",
  data: {
    events: null,
    year: currentYear,
    state: "uninitialized",
  },
  async created() {
    const response = await fetch(calendar_api);
    let data = undefined;
    if (response.ok) {
      data = await response.json();
      this.events = parseCal(data);
      this.state = "good_response";
    } else {
      this.state = "bad_response";
    }
  },
});
