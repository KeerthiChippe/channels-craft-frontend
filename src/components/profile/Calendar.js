// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Calendar.css'

// export default function Calendar({ formattedDates }) {

//   return (
//     // <div style={{ position: 'absolute', top: '80px', right: '20px', zIndex: '99' }}>
//     //   <div style={{ width: '700px', margin: 'auto' }}>
//     //     <FullCalendar
//     //       plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//     //       initialView={'dayGridMonth'}
//     //       headerToolbar={{
//     //         start: "",
//     //         center: "title",
//     //         end: "today prev, next"
//     //       }}
//     //       events={formattedDates.map(({ type, name, expiryDate }) => ({
//     //         title: `${type === 'package' ? 'Package' : 'Channel'}: ${name}`,
//     //         start: expiryDate,
//     //         allDay: true,
//     //       }))}
//     //     />
//     //   </div>
//     // </div>
//     <div className="calendar-container">
//       <div className="calendar-content">
//         <FullCalendar
//           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//           initialView={'dayGridMonth'}
//           headerToolbar={{
//             start: "",
//             center: "title",
//             end: "today prev,next"
//           }}
//           events={formattedDates.map(({ type, name, expiryDate }) => ({
//             title: `${type === 'package' ? 'Package' : 'Channel'}: ${name}`,
//             start: expiryDate,
//             allDay: true,
//           }))}
//           eventClassNames="custom-event"
//         />
//       </div>
//     </div>
//   )
// }


import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, Tooltip, Typography, Space, Tag } from "antd";
import { motion } from "framer-motion";
import { FaBox, FaTv } from "react-icons/fa";
import "./Calendar.css";

const { Title, Text } = Typography;

const Calendar = ({ formattedDates }) => {
  // Animation variants for the calendar container
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation variants for events
  const eventVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  // Format event title with ellipsis for names longer than 4 characters
  const formatEventTitle = (type, name) => {
    const prefix = type === "package" ? "📦" : "📺";
    const shortName = name.length > 6 ? `${name.slice(0, 6)}...` : name;
    return `${prefix} ${shortName}`;
  };

  return (
    <motion.div
      className="container mx-auto p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card
        className="shadow-xl rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 248, 0.9) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <Title level={3} className="mb-6 text-gray-900 text-center">
          Subscription Calendar ✨📅
        </Title>
        <Space direction="horizontal" size="middle" className="mb-6 justify-center w-full" style={{ margin: "15px" }}>
          <Tag color="blue" icon={<FaBox style={{ marginRight: "5px" }} />}>
            Packages
          </Tag>
          <Tag color="green" icon={<FaTv style={{ marginRight: "5px" }} />}>
            Channels
          </Tag>
        </Space>
        <div className="calendar-content">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "dayGridMonth,timeGridWeek",
              center: "title",
              end: "today prev,next",
            }}
            events={formattedDates.map(({ type, name, expiryDate }) => ({
              title: formatEventTitle(type, name),
              start: expiryDate,
              allDay: true,
              classNames: [
                "custom-event",
                type === "package" ? "event-package" : "event-channel",
              ],
              extendedProps: { type, name, expiryDate },
            }))}
            eventContent={(eventInfo) => (
              <Tooltip
                title={
                  <div>
                    <Text strong>{eventInfo.event.extendedProps.type === "package" ? "Package" : "Channel"}:</Text>{" "}
                    {eventInfo.event.extendedProps.name}
                    <br />
                    <Text>Expires: {eventInfo.event.extendedProps.expiryDate}</Text>
                  </div>
                }
                color="#fff"
                overlayInnerStyle={{ color: "#1a1a1a", padding: "12px", borderRadius: "8px" }}
              >
                <motion.div
                  variants={eventVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  className="fc-event-main"
                >
                  {eventInfo.event.title}
                </motion.div>
              </Tooltip>
            )}
            height="auto"
            contentHeight="550px"
            eventDidMount={(info) => {
              info.el.style.animation = "pulse 1.5s infinite";
            }}
            datesSet={(dateInfo) => {
              const calendarApi = dateInfo.view.calendar;
              if (dateInfo.view.type === "timeGridWeek") {
                // Show only all-day slot in week view
                calendarApi.setOption("allDaySlot", true);
                // Disable time slots to show only all-day events
                calendarApi.setOption("slotMinTime", "00:00:00");
                calendarApi.setOption("slotMaxTime", "00:00:00");
                calendarApi.setOption("slotDuration", "24:00:00");
                calendarApi.setOption("slotLabelFormat", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  omitCommas: true,
                });
                // Hide time labels on the y-axis
                calendarApi.setOption("displayEventTime", false);
                calendarApi.setOption("slotLabelInterval", null);
              } else {
                // Reset for other views (e.g., month view)
                calendarApi.setOption("allDaySlot", true);
                calendarApi.setOption("slotMinTime", "00:00:00");
                calendarApi.setOption("slotMaxTime", "24:00:00");
                calendarApi.setOption("slotDuration", "00:30:00");
                calendarApi.setOption("slotLabelFormat", null);
                calendarApi.setOption("displayEventTime", true);
                calendarApi.setOption("slotLabelInterval", null);
              }
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default Calendar;