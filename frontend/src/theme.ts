// src/theme.ts
import { createTheme,  } from '@mantine/core';


export const theme = createTheme({
  white: '#FFFFFF',
  black: '#000000',
  fontFamily: 'Roboto, sans-serif',
  primaryColor: "brand2",
  colors: {
    green: ['#3B724D', '#49845C', '#559569', '#66A97C',  '#71AE84', '#84B995;', '#A1C8AD', '#C4DBCC', '#E4EEE7', '#F2F8F4'],
    brand: ["#F2F8F4", "#E4EEE7", "#C4DBCC", "#A1C8AD", "#84B995", "#71AE84", "#66A97C", "#559569", "#49845C", "#3B724D"],
    brand2: ["#F2F8F4", "#E4EEE7", "#C4DBCC", "#A1C8AD", "#84B995", "#71AE84", "#3B724D", "#559569", "#49845C", "#3B724D"],
    black: ["#C0C0C0", "#B8B8B8", "#A9A9A9", "#A0A0A0", "#909090", "#707070", "#585858", "383838", "#181818", "#000000"],
  },
  headings: {
  fontWeight:'bold',
  textWrap:'wrap',
  sizes: {
      h1: { fontSize:'26px', lineHeight:'32px'},
      h2: { fontSize:'20px', lineHeight:'25px'},
      h3: { fontSize:'14px', lineHeight:'16px'},
  },
  },
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '82em',
    xl: '90em',
  },
  components: {
    // Modal : Modal.extend({
    //   vars: {content: {"--modal-size": rem(50)}}
    Button:{
      defaultProps: {
        color: 'green.3',
      },
      // styles: (theme: MantineTheme)=> ({
      //   root:{
      //     backgroundColor: theme.colors.green[0],
      //     '&:hover': {
      //     backgroundColor: theme.colors.green[6],
      //     },
      //   },
      // })
    },
    Paper:{
      defaultProps: {
        shadow:"sm",
        withBorder: true,
        radius: "md",
        p:"lg"
      }
    },
    Table: {
      defaultProps: {
        borderColor: "green.8",
        verticalSpacing:"md",
        highlightOnHoverColor: "green.8"
      }
    },
    ActionItem: {
      defaultProps: {
        variant: "outline",
        color: "green.3",
      }
    },
  },
});
    // ... other theme override properties

