import type { AppContext } from '@slidev/types'
import { useNav } from '@slidev/client'

// May be moved outside of this file into the types package of slidev
// -> not that easy for mwp bcs of separate types package
interface SlideMessage {
  appId: 'slidev'
  data: {
    type: 'slide.navigate' | 'slide.next' | 'slide.prev'
    value?: number
  }
}

/**
 * Message bridge to accept window post messages and trigger navigation.
 */
export default function setupMessageBridge(_ctx: AppContext) {
  if (typeof window === 'undefined')
    return

  const handleMessage = async (data: any) => {
    try {
      const { nextSlide, prevSlide } = useNav()
      switch (data?.type) {
        case 'slide.navigate':
          break
        case 'slide.next':
          await nextSlide()
          break
        case 'slide.prev':
          await prevSlide()
          break
        default:
          console.warn('[MessageBridge] Unknown message type:', data?.type)
      }
    }
    catch (err) {
      console.error('[MessageBridge] Error handling message:', err)
    }
  }

  const handler = (event: MessageEvent) => {
    try {
      // Maybe extend in the future with origin checkin

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
}
