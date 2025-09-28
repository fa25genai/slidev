import type { SlideMessage, SlideMessageData } from '@slidev/client/setup/message-types'
import type { AppContext } from '@slidev/types'
import { useNav } from '@slidev/client'

/**
 * Message bridge to accept window post messages and trigger navigation.
 */
export default function setupMessageBridge(_ctx: AppContext) {
  if (typeof window === 'undefined')
    return

  const handleMessage = async (data: SlideMessageData) => {
    try {
      const { nextSlide, prevSlide, go } = useNav()
      switch (data.type) {
        case 'slide.navigate':
          await go(data.slideNbr, data.clicks)
          break
        case 'slide.next':
          await nextSlide()
          break
        case 'slide.prev':
          await prevSlide()
          break
      }
    }
    catch (err) {
      console.error('[MessageBridge] Error handling message:', err)
    }
  }

  const handler = (event: MessageEvent<SlideMessage>) => {
    try {
      // Maybe extend in the future with origin checking

      const payload = event.data as unknown
      if (!payload || typeof payload !== 'object') {
        return
      }

      const slideMessage = payload as SlideMessage

      if (slideMessage.appId !== 'slidev') {
        return
      }

      void handleMessage(slideMessage.data)
    }
    catch (err) {
      console.error('[MessageBridge] Failed to process message event:', err)
    }
  }

  window.addEventListener('message', handler)

  return () => {
    window.removeEventListener('message', handler)
  }
}
