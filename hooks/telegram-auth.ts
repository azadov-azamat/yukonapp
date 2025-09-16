// useTelegramAuth.ts
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const BOT_ID = '7632634366';

// Dev/prod muhitga mos domenni ENV’dan o’qing:
const PUBLIC_WEB_DOMAIN = 'https://a036873e9727.ngrok-free.app'; // BotFather’da qo‘shganingiz

export function useTelegramAuth() {
  // Web uchun HTTPS callback; Native uchun esa scheme
  const redirectUri =
    Platform.OS === 'web'
      ? `${PUBLIC_WEB_DOMAIN}/auth/telegram/callback`
      : AuthSession.makeRedirectUri({}); // yourapp://auth

  // Telegram tekshiradigan origin — ruxsat berilgan HTTPS domen
  const origin = PUBLIC_WEB_DOMAIN;

  const authUrl =
    'https://oauth.telegram.org/auth' +
    `?bot_id=${BOT_ID}` +
    `&origin=${encodeURIComponent(origin)}` +
    `&request_access=write` +            // kerak bo'lmasa olib tashlang
    `&return_to=${encodeURIComponent(redirectUri)}`;

  const start = async () => {
    const res = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    console.log('Telegram auth natija:', res);
    return res; // res.type: 'success' | 'cancel' | 'dismiss'; res.url bo'lsa, undan paramlarni oling
  };

  return { start, redirectUri };
}
