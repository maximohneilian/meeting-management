import { Box } from "@mantine/core";
import {
  Document,
  PDFViewer,
  Page,
  View,
  StyleSheet,
  Font,
  Image,
  Text,
} from "@react-pdf/renderer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import PdfMeetingInfo from "../components/meetingDetails/pdfAgendaDetails";
import logo from "../assets/images/logos/Cannabees_Logo_green_4.png";

const PdfExportPage = () => {
  const dispatch = useDispatch();
  const meetingDetails = useAppSelector(
    (state) => state.meetingDetails.selectedMeeting
  );

  useEffect(() => {
    if (meetingDetails) {
      console.log("SHOW ME THE DATA!", meetingDetails);
    }
  }, [dispatch, meetingDetails]);

  Font.register({
    family: "Roboto",
    lineHeight: 1.5,

    fonts: [
      { src: "http://fonts.gstatic.com/s" + "/Open_Sans/OpenSans-Regular.ttf" },
      {
        src: "http://fonts.gstatic.com/s" + "/Open_Sans/OpenSans-Bold.ttf",
        fontWeight: "bold",
      },
      {
        src: "http://fonts.gstatic.com/s" + "/Open_Sans/OpenSans-Italic.ttf",
        fontStyle: "italic",
      },
      {
        src:
          "http://fonts.gstatic.com/s" + "/Open_Sans/OpenSans-BoldItalic.ttf",
        fontWeight: "bold",
        fontStyle: "italic",
      },
    ],
  });
  const styles = StyleSheet.create({
    title: {
      fontFamily: "Roboto",
      fontStyle: "bold",
      fontSize: "20px",
      lineHeight: 1.5,
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingRight: 5,
      alignItems: "flex-start",
    },
    text: {
      fontFamily: "Roboto",
      fontStyle: "bold",
      fontSize: "12px",
      lineHeight: 1.25,
    },
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 10,
    },
    section: {
      margin: 5,
      padding: 10,
      flexGrow: 1,
    },
    logo: {
      width: 50,
      height: 50,
    },
    footer: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
    },
  });

  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {" "}
          <Image style={styles.logo} src={logo} />
        </View>
        <View style={styles.section}>
          {meetingDetails && <PdfMeetingInfo meetingDetails={meetingDetails} />}
        </View>
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );

  // ReactDOM.render(<PdfExportPage />, document.getElementById('root'));

  return (
    <Box style={{ height: "100%", width: "100%" }}>
      <PDFViewer
        style={{
          width: "100%",
          height: "calc(100vh - 90px)",
          borderRadius: "10px",
        }}
      >
        <MyDocument />
      </PDFViewer>
    </Box>
  );
};

export default PdfExportPage;
