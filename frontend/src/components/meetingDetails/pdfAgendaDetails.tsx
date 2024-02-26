import { Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  AgendaPointInterface,
  MeetingDetailsInterface,
  UserInterface,
  Files,
} from "../../interfaces";
import Html from "react-pdf-html";

const styles = StyleSheet.create({
  main: {
    display: "flex",
    flexGrow: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontStyle: "bold",
    lineHeight: 1.25,
    color: "#3B724D",
  },
  section: {
    gap: 10,
    display: "flex",
    justifyContent: "flex-start",
    border: 1,
    padding: 10,
    borderColor: "#A1C8AD",
    borderRadius: 4,
    marginBottom: 10,
  },
  placeHolder: {
    gap: 5,
    display: "flex",
    justifyContent: "flex-start",
  },
  container: {
    gap: 5,
    display: "flex",
    justifyContent: "flex-start",
    padding: 5,
  },
  header: {
    fontSize: 14,
    fontStyle: "bold",
    lineHeight: 1.25,
  },
  label: {
    fontSize: 14,
    fontStyle: "bold",
    lineHeight: 1.25,
    width: 100,
  },
  titleUnderline: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#A1C8AD",
    borderBottomStyle: "solid",
  },
  info: { fontSize: 12, fontWeight: 700, lineHeight: 1.25 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    lineHeight: 1.5,
    rowGap: 10,
    justifyContent: "flex-start",
    flexGrow: 4,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",

  },
  orderNumber: {
    fontSize: 18,
    lineHeight: 1.25,
    fontWeight: 800,
    marginRight: 5,
    marginTop: 5,
  },
});

const htmlStylesheet = StyleSheet.create({
  h1: {
    fontSize: 18,
    lineHeight: 1.25,
    fontWeight: 600,
    marginTop: 2,
    marginBottom: 2,
  },
  h2: {
    fontSize: 16,
    lineHeight: 1.25,
    fontWeight: 500,
    marginTop: 2,
    marginBottom: 2,
  },
  h3 : {
    fontSize: 14,
    lineHeight: 1.25,
    fontWeight: 500,
    marginTop: 2,
    marginBottom: 2,
  },
  h4 : {
    fontSize: 14,
    lineHeight: 1.25,
    fontWeight: 400,
    marginTop: 2,
    marginBottom: 2,
  },
  p: {
    fontSize: 11,
    lineHeight: 1,
  },
  ol: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  ul: {
    width: "100%",
  },
  li: {
    width: "100%",
    display: "flex",
    lineHeight: 1.25,
    flexDirection: "row",
  },
  strong: {
    fontWeight: 'bold',
    // fontStyle: "bold"
  },
  em: {
    fontStyle: "italic",
  }

});

const PdfMeetingInfo: React.FC<{ meetingDetails: MeetingDetailsInterface }> = ({
  meetingDetails,
}) => {
  const sortedAgendaPoints = [...meetingDetails.agenda_points].sort(
    (a: AgendaPointInterface, b: AgendaPointInterface) => a.order - b.order
  );

  // const elements = sortedAgendaPoints.map(
  //   (item: AgendaPointInterface, index) => (
  //     <div>
  //       <h2>
  //         {item.order}. {item.title}
  //       </h2>
  //       <div>{item.notes}</div>
  //     </div>
  //   )
  // ).reduce((Accumulator, CurrentValue) => , <div></div>)

  // const html = ReactDOMServer.renderToStaticMarkup(MyCombinedProvider(elements))

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.title}>{meetingDetails.title}</Text>
        <View style={styles.titleUnderline}></View>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.info}>
              {new Date(meetingDetails.start_time).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.info}>{meetingDetails.location}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Participants: </Text>
            <Text style={styles.info}>
              {meetingDetails.guests
                .map(
                  (guest: UserInterface) =>
                    `${guest.first_name} ${guest.last_name}`
                )
                .join(", ")}
            </Text>
          </View>
        </View>
        <View style={styles.placeHolder}>
          <Text style={styles.title}>Notes</Text>
          {sortedAgendaPoints.map((item: AgendaPointInterface, index) => (
            <View key={`agendaItem-${index}`} style={styles.container}>
              <View style={styles.sectionRow}>
                <Text style={styles.orderNumber}>
                  {item.order}. {item.title}
                </Text>
              </View>
              {item.notes && (
                <Html
                  stylesheet={htmlStylesheet}
                  style={{ marginLeft: 25, marginTop: 5 }}
                >
                  {item.notes}
                </Html>
              )}
              {meetingDetails.meeting_files &&
                meetingDetails.meeting_files.map((file: Files, fileIndex) => (
                  <View key={`file-${fileIndex}`} style={styles.info}>
                    <Text style={styles.header}>{file.file}</Text>
                  </View>
                ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PdfMeetingInfo;
