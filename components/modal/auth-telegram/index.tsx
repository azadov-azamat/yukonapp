import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import DynamicModal from '../dialog';
import { Text, TouchableOpacity, Platform } from 'react-native';
import { get } from 'lodash';
import Toast from 'react-native-toast-message';

// CookieManager faqat mobil platformada yuklanadi
let CookieManager: any;
if (Platform.OS !== 'web') {
  CookieManager = require('@react-native-cookies/cookies').default;
}

const TelegramLogin = ({
  getRef,
  open,
  setOpen
}: {
  getRef: any;
  setOpen: any;
  open: boolean;
}) => {
  let webViewRef = useRef<WebView>(null);

  useEffect(() => {
    let ref = {
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
    // console.log('TelegramLogin ref', getRef, ref);
    // if (getRef) {
      getRef(ref);
    // }
    // getRef.current(ref);

  }, []);

  const jsCode = `
    ReactNativeWebView.postMessage(document.cookie);
    true
  `;

  const handleTelegramAuth = () => {
    console.log("CookieManager", CookieManager)
    if (Platform.OS === 'web') {
      console.log('CookieManager web platforma uchun mo‘ljallangan');
      // console.warn('CookieManager mobil platforma uchun mo‘ljallangan');
      return;
    }
    console.log("CookieManager", CookieManager)
    CookieManager.get('https://oauth.telegram.org', true)
      .then((data: any) => {
        const stel_ssid = get(data, 'stel_ssid.value', '');
        const stel_token = get(data, 'stel_token.value', '');

        fetch('https://oauth.telegram.org/auth/get?bot_id=6803228860', {
          headers: {
            'content-type':
              'application/x-www-form-urlencoded; charset=UTF-8',
            'x-requested-with': 'XMLHttpRequest',
            cookie: `stel_ssid=${stel_ssid}; stel_ln=ru; stel_token=${stel_token}`,
          },
          body: 'origin=https%3A%2F%2Fcore.telegram.org&embed=1&return_to=https%3A%2F%2Fcore.telegram.org%2Fwidgets%2Flogin',
          method: 'POST',
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('data is', data);
            const user = data.user;
            console.log('user is', user);
            setOpen(false);
          })
          .catch((err) => {
            setOpen(false);
            Toast.show({
              type: 'error',
              text1: 'Xatolik yuz berdi',
              text2: "Qayta urinib ko'ring",
            });
          });
      })
      .catch((err: any) => {
        console.error('Cookie error:', err);
        setOpen(false);
        Toast.show({
          type: 'error',
          text1: 'Xatolik yuz berdi',
          text2: "Qayta urinib ko'ring",
        });
      });
  };
console.log('TelegramLogin render', open);
  return (
    <DynamicModal open={setOpen} toggle={() => setOpen(!open)}>
      {Platform.OS === 'web' ? (
  <iframe
    src={`https://oauth.telegram.org/auth?bot_id=6803228860&origin=https://core.telegram.org&return_to=https://core.telegram.org&lang=en`}
    style={{ width: '100%', height: '500px', border: 'none' }}
  />
) : (
      <WebView
        ref={webViewRef}
        thirdPartyCookiesEnabled={true}
        injectedJavaScript={jsCode}
        onNavigationStateChange={(event) => {
          if (
            event.url.startsWith('https://core.telegram.org/#tgAuthResult')
          ) {
            console.log('Navigation state changed:', event.url);
            webViewRef.current?.injectJavaScript(jsCode);
            handleTelegramAuth();
          }
        }}
        source={{
          uri: `https://oauth.telegram.org/auth?bot_id=6803228860&origin=https://core.telegram.org&return_to=https://core.telegram.org&lang=en`,
        }}
        onMessage={(event) => {
          console.log('onMessage', event.nativeEvent.data);
        }}
        style={{ flex: 1 }}
      />
)}
    </DynamicModal>
  );
};

export default TelegramLogin;
