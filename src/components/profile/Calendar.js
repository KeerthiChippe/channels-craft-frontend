import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Calendar.css'

export default function Calendar({ formattedDates }) {

  return (
    // <div style={{ position: 'absolute', top: '80px', right: '20px', zIndex: '99' }}>
    //   <div style={{ width: '700px', margin: 'auto' }}>
    //     <FullCalendar
    //       plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    //       initialView={'dayGridMonth'}
    //       headerToolbar={{
    //         start: "",
    //         center: "title",
    //         end: "today prev, next"
    //       }}
    //       events={formattedDates.map(({ type, name, expiryDate }) => ({
    //         title: `${type === 'package' ? 'Package' : 'Channel'}: ${name}`,
    //         start: expiryDate,
    //         allDay: true,
    //       }))}
    //     />
    //   </div>
    // </div>
    <div className="calendar-container">
      <div className="calendar-content">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={'dayGridMonth'}
          headerToolbar={{
            start: "",
            center: "title",
            end: "today prev,next"
          }}
          events={formattedDates.map(({ type, name, expiryDate }) => ({
            title: `${type === 'package' ? 'Package' : 'Channel'}: ${name}`,
            start: expiryDate,
            allDay: true,
          }))}
          eventClassNames="custom-event"
        />
      </div>
    </div>
  )
}


