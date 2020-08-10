

output.rallyEvents.items.forEach(event => {
  eventDays = event.eventDays
  start_date = eventDays[0]['eventDay']
  end_date = eventDays[eventDays.length - 1]['eventDay']
  eventInfo = `https://www.wrc.com${event.pageInfo['url']}`
  console.log(`${event.name}: ${start_date} - ${end_date} ${eventInfo}`)
})

output.rallyEvents.items[0]
output.rallyEvents.items[0].eventDays[0]
output.rallyEvents.items[0].eventDays[-1]