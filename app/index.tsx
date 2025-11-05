import { useAssets } from 'expo-asset';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const IndexScreen = () => {
  const [assets] = useAssets([require('@/assets/videos/intro-video.mp4')]);

  return (
    <View style={styles.container}>
      {assets && (
        <Video
          resizeMode={ResizeMode.COVER}
          isMuted
          isLooping
          shouldPlay
          source={{ uri: assets[0].uri }}
          style={styles.video}
        />
      )}

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Ruph</Text>
        <Text style={styles.title}>Automations</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href='/(auth)/sign-up' asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
        <Link href='/(auth)/log-in' asChild>
          <TouchableOpacity
            style={{
              height: 55,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#ffffff',
              backgroundColor: 'transparent',
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: 18,
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  titleContainer: {
    marginTop: 80,
    padding: 20,
  },
  title: {
    fontSize: 40,
    color: '#ffffff', // white text
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  button: {
    // width: '50%', // full width
    flex: 1,
    height: 55,
    backgroundColor: '#007bff', // blue
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff', // white text
    fontWeight: 'bold',
    fontSize: 18,
  },
});
