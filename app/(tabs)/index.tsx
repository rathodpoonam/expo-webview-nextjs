import React, { useEffect, useRef } from 'react';
import { Linking, Alert } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

export default function App() {
  const webviewRef = useRef<WebView | null>(null);

  // Handle navigation inside WebView
  const handleNavigation = (event: WebViewNavigation) => {
    const url = event.url;

    // Check if it's a Google sign-in redirect URL
    if (url.startsWith('https://accounts.google.com/')) {
      // Stop WebView from handling it (Google OAuth flow)
      if (webviewRef.current) {
        webviewRef.current.stopLoading();
      }

      // Open Google Sign-In flow in an external browser
      Linking.openURL(url).catch((err) =>
        Alert.alert('Error', 'Unable to open the browser')
      );
      return false; // Prevent WebView from loading this URL
    }

    // Check if the user was redirected back after a successful login
    if (url.includes('https://next-auth-poonam-rathods-projects.vercel.app/api/auth/callback/google')) {
      // Handle the redirect URL and update your WebView content if necessary
      if (webviewRef.current) {
        webviewRef.current.stopLoading();
        webviewRef.current.reload(); // Reload the page to continue after login
      }
      return false; // Prevent further WebView navigation
    }

    return true; // Allow WebView to continue handling other navigation
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: 'https://next-auth-poonam-rathods-projects.vercel.app/' }}
      originWhitelist={['*']}
      onShouldStartLoadWithRequest={handleNavigation}
      javaScriptEnabled
      domStorageEnabled
    />
  );
}
