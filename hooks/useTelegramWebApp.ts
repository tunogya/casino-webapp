import {useCallback, useEffect, useState} from "react";
import axios from "axios";

interface TelegramUser {
  id: number
  first_name: string
  last_name: string
  username: string
  language_code: string
}

const useTelegramWebApp = () => {
  const [user, setUser] = useState<TelegramUser | undefined>(undefined)
  const [isValid, setIsValid] = useState<boolean>(false)

  const valid = useCallback(async () => {
    if (typeof window === 'undefined') {
      // @ts-ignore
      window?.Telegram?.WebApp.ready();
      // @ts-ignore
      const initData = window?.Telegram?.WebApp?.initData || "";
      // @ts-ignore
      const initDataUnsafe = window?.Telegram?.WebApp?.initDataUnsafe || {};
      setUser(initDataUnsafe?.user || undefined)

      if (initData) {
        const res = await axios("/api/telegram", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            _auth: initData,
          }
        });
        if (res.status === 200) {
          setIsValid(true)
        }
      }
    }
  }, [])

  useEffect(() => {
    valid()
  }, [valid])

  return {
    user,
    isValid,
  }
}

export default useTelegramWebApp