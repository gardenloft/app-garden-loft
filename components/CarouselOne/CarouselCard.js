// // components/CarouselCard.js
// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

// const CarouselCard = ({ iconName, label }) => {
//   return (
//     <View style={styles.card}>
//       <Icon name={iconName} size={80} color="#000" />
//       <Text style={styles.label}>{label}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     width: viewportWidth * 0.16,
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//     marginHorizontal: 10,
//   },
//   label: {
//     marginTop: 10,
//     fontSize: 30,
//     fontWeight: 'bold',
//   },
// });

// export default CarouselCard;

// components/CarouselCard.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width: viewportWidth } = Dimensions.get("window");

const CarouselCard = ({ iconName, label, cardWidth }) => {
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Icon name={iconName} size={80} color="#000" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3b718',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 0.1,
  },
  label: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CarouselCard;







