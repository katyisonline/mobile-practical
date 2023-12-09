
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [image, setImage] = useState(null)

  const takePicture = () => {
    console.log('heyy')
  }

  const saveToDb = () => {
    console.log('shorty')
  }

  const getFromDb = () => {
    console.log('pookie')
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.headerText} >FINAL EXAM</Text>
        <Text style={styles.headerText}>K_MOLLOY</Text>
      </View>


      <TouchableOpacity style={styles.picture} onPress={takePicture}>
        {image ?
          <Image source={{ uri: image }} />
          :
          <Image
            style={styles.images}
            source={require('./assets/placeholder.png')} />}

      </TouchableOpacity>

      <Text style={styles.secondHeader}>
        NOTE
      </Text>
      <View style={styles.textBox}>
        <TextInput placeholder="Add notes here ... ">

        </TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="VIEW NOTES" color={'black'} onPress={getFromDb} />
        <Button title="SAVE" color={'black'} onPress={saveToDb} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    justifyContent: 'center',
    top: 50,
    position: 'absolute'
  },
  buttonContainer: {
    padding: 10,
    gap: 10,
    width: '75%'
  },
  textBox: {
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
    width: '70%',
    height: 80
  },
  images: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  picture: {
    borderWidth: 2,
    height: 200,
    justifyContent: 'center',
    marginBottom: 10,
    width: '70%',
  },
  headerText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '500'
  },
  secondHeader: {
    alignSelf: 'flex-start',
    marginLeft: 58,
    paddingTop: 15,
    fontWeight: '500',
    fontSize: 18
  }

});

