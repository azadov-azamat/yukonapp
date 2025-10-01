import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnalyticsEventSerializer } from "@/serializers";
import { isAuthEndpoint } from "@/utils/general";

export const baseUrl = `${process.env.EXPO_PUBLIC_BACKEND_HOST}/api`;
// ⭐️ tracking endpoint
const TRACK_URL = `${process.env.EXPO_PUBLIC_BACKEND_HOST}/api/analytics-events`;

export const http = axios.create({
    baseURL: baseUrl,
    headers: {
        Accept: "application/json",
    },
})

// 🔹 yordamchi: trackingni fire-and-forget yuboramiz
async function sendTrack(data: any, token?: string) {
  try {
    // fetch ni await qilmaymiz — asosiy API javobini kutdirib qo'ymasin
    fetch(TRACK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(AnalyticsEventSerializer.serialize(data)),
    }).catch(() => {});
  } catch {}
}

http.interceptors.request.use(async (config) => {
    const authData = await AsyncStorage.getItem('authenticate');
    let token: string | undefined;
    
    if (authData) {
        try {
            const { token: t } = JSON.parse(authData);
            if (t) {
                token = t;
                config.headers['Authorization'] = `Bearer ${t}`;
            }
        } catch (error) {
            console.error('Error parsing authentication data:', error);
        }
    }

     // ⏱ boshlanish vaqtini meta sifatida biriktiramiz
    (config as any).__startedAt = Date.now();
    (config as any).__authToken = token;

    // trackingning o'zini track qilmaslik + ixtiyoriy bayroq
    const url = (config.baseURL ?? "") + (config.url ?? "");
    if (url.includes(TRACK_URL)) {
      (config as any).__skipTrack = true;
    }
    if ((config.headers as any)["X-Skip-Track"]) {
      (config as any).__skipTrack = true;
    }

    return config;
}, (error) => {
    console.log("error - 29", error);
    if (error.response?.status === 401) {
        console.log("401");
        // const router = useRouter();
        // router.push("/");
    }
    return Promise.reject(error);
});

// -------- Response / Error interceptors --------
http.interceptors.response.use(
  async (response) => {
    const cfg: any = response.config;
    const shouldTrack = !!(cfg.headers && (cfg.headers as any)['X-Track']);
    if (shouldTrack) {
        const duration = Date.now() - (cfg.__startedAt ?? Date.now());
        const payload = {
            platform: "mobile",                     // mobil ilova uchun
            pageUrl: "",                            // RN’da yo‘q, lekin kerak bo‘lsa ekran nomini yuboring
            platformInfo: "react-native",           // qo‘shimcha info
            eventType: (cfg.headers as any)['X-Track-Event'] ?? "api_call",
            textMessage: (cfg.headers as any)['X-Track-Message'] ?? `API call to ${cfg.url}`,
            metadata: JSON.stringify({              // metadata STRING bo‘lishi shart!
                endpoint: cfg.url,
                method: (cfg.method ?? "GET").toUpperCase(),
                status: response.status,
                durationMs: duration,
                ...JSON.parse((cfg.headers as any)['X-Track-Meta']) ?? {},
            }),
        };
        
      let trackToken: string | undefined = cfg.__authToken;

      // 2) login/refresh payti: tokenni javobdan olish
      if (!trackToken && isAuthEndpoint(cfg.url)) {
        trackToken = response.data && (response.data.token)
      }

      sendTrack(payload, trackToken);
    }
    return response;
  },
  async (error) => {
    const cfg: any = error.config ?? {};
    try {
      if (!cfg.__skipTrack) {
        const duration = Date.now() - (cfg.__startedAt ?? Date.now());
        const status = error.response?.status ?? 0;
        const payload = {
            platform: "mobile",                     // mobil ilova uchun
            pageUrl: "",                            // RN’da yo‘q, lekin kerak bo‘lsa ekran nomini yuboring
            platformInfo: "react-native",           // qo‘shimcha info
            eventType: "fail_" + ((cfg.headers as any)['X-Track-Event'] ?? "api_call"),
            textMessage: (cfg.headers as any)['X-Track-Message'] ?? `API call to ${cfg.url}`,
            metadata: JSON.stringify({              // metadata STRING bo‘lishi shart!
                endpoint: cfg?.url,
                method: (cfg?.method ?? "GET").toUpperCase(),
                status,
                durationMs: duration,
                error: String(error?.message ?? "request_failed"),
            }),
        };
        sendTrack(payload, cfg.__authToken);
      }
    } catch {}
    // 401 va h.k. bilan o'zingiz ishlaysiz
    if (error?.response?.status === 401) {
      // masalan: navigation reset qilish va hokazo
    }
    return Promise.reject(error);
  }
);
