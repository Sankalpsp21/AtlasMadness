import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, SplashScreen, Stack } from 'expo-router';
import { NativeBaseProvider, extendTheme } from "native-base";
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Splash from '../components/Splash';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'landing/index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#E3F2F9',
        100: '#C5E4F3',
        200: '#A2D4EC',
        300: '#7AC1E4',
        400: '#47A9DA',
        500: '#0088CC',
        600: '#007AB8',
        700: '#006BA1',
        800: '#005885',
        900: '#003F5E',
      },
      bg: {
        shade: "#2870F1",
        shadeDark: "#1E60D5"
      }
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: 'dark',
    },
  });
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      <NativeBaseProvider theme={theme}>
        {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
        {!loaded && <Splash />}
        {loaded && <RootLayoutNav />}
      </NativeBaseProvider>
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();


  return (
    <>

      {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
      {/* <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack> */}
      <Stack>
        <Stack.Screen name="landing/index" options={{ headerShown: false }} />
        <Stack.Screen name="integrations/index" options={{ headerShown: false }} />
      </Stack>
      {/* </ThemeProvider> */}

    </>
  );
}
