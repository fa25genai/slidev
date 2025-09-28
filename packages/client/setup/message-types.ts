export interface SlideMessage {
  appId: 'slidev'
  data: {
    type: 'slide.navigate' | 'slide.next' | 'slide.prev'
    slideNbr: number
    clicks: number
  }
}
export type SlideMessageData = SlideMessage['data']
