
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, TextInput, Button } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import { SQLite } from 'expo-sqlite';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';



export default function App() {
  const [image, setImage] = useState()
  const [camera, setCamera] = useState(null)
  const [cameraPermission, setCameraPermission] = useState();
  const [showCamera, setShowCamera] = useState(false)
  const [userNote, setUserNote] = useState('');

  // intializing db
  const db = SQLite.openDatabase('practicalExamDB');

  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Notes(id INTEGER PRIMARY KEY NOT NULL, photo TEXT, note TEXT);', [],
      () => console.log('TABLE CREATED')),
      (_, result) => console.log('TABLE CREATE failed: ' + result)
  })

  // permissions are set on app launch
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted")
    })();
  }, [])

  const takePicture = async () => {
    // displaying the camera view
    setShowCamera(false)

    if (camera) {
      // defining some options for the camera
      let options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      // try / catch block to log any errors
      try {
        // if takePictureAsync was successful, the image state is set with the most recent uri
        let data = await camera.takePictureAsync(options);
        setImage(data.uri);

        saveToFiles(data.uri)
      } catch (error) {
        console.log('Error taking picture: ', error);
      }
    }
  }

  const photoOptions = () => {
    Alert.alert(
      "Image Options",
      "Take a Photo or Choose from Library",
      [
        {
          text: 'CAMERA',
          onPress: () => setShowCamera(true)
        },
        {
          text: 'LIBRARY',
          onPress: () => pickFromLibrary()
        }
      ]
    )
  }


  const pickFromLibrary = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      console.log(result)
      setImage(result.assets[0].uri);
      saveToFiles(result.assets[0].uri)
      console.log('Image uploaded')
    } else {
      console.log('No image selected')
    }

  }

  // function to save data to SQLite db
  const saveToDb = (image, note) => {
    db.transaction(
      tx => {
        tx.executeSql('INSERT INTO Notes {photo, note} VALUES (?, ?)',
          [image, note],
          (_, { rowsAffected }) =>
            rowsAffected > 0 ? console.log('ROW INSERTED') :
              console.log('INSERT FAILED'), (_, result) => console.log('INSERT FAILED: ' + result))
      }
    )
  };

  const getFromDb = () => {
    console.log('pookie')
  }


  // function to save files to local app storage
  const saveToFiles = async (imageURI) => {
    // file name is created from URI file path; unique end value is taken
    const fileName = imageURI.split('/').pop();

    const newURI = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({
        from: imageURI,
        to: newURI
      });
      console.log('File saved')
      // error logged if occured
    } catch (error) {
      console.log('Error saving image to file system: ', error)
    }
  }



  const saveDataHandler = () => {
    console.log('heyy ', userNote)
    saveToDb(image, userNote)
  }

  return (
    <View style={styles.container}>
      {showCamera ?

        <>
          <View style={styles.cameraContainer}>
            <Camera ref={ref => setCamera(ref)}
              onCameraReady={() => setCamera(true)}
              ratio="16:9"
              style={styles.cameraLayout}
            />
            <TouchableOpacity style={styles.buttonStyle} onPress={takePicture}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity >
          </View>

        </>
        :
        <>
          <View style={styles.title}>
            <Text style={styles.headerText} >FINAL EXAM</Text>
            <Text style={styles.headerText}>K_MOLLOY</Text>
          </View>


          <TouchableOpacity style={styles.picture} onPress={photoOptions}>
            {image ?
              <Image
                style={styles.images}
                source={{ uri: image }} />
              :
              <Image
                style={styles.images}
              // source={require('./assets/placeholder.png')}
              />}

          </TouchableOpacity>

          <Text style={styles.secondHeader}>
            NOTE
          </Text>
          <View style={styles.textBox}>
            <TextInput placeholder="Add notes here ... " onTextChange={(value) => setUserNote(value)}>

            </TextInput>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="VIEW NOTES" color={'black'} onPress={getFromDb} />
            <Button title="SAVE" color={'black'} onPress={saveDataHandler} />
          </View>
        </>
      }

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
  },
  cameraContainer: {
    flex: 0.95,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  cameraLayout: {
    flex: 1,
  },
  buttonStyle: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20

  }

});

