import * as nrvideo from "newrelic-video-core";
import { version } from "../package.json";

export default class CAFAdsTracker extends nrvideo.VideoTracker {
  getTrackerName() {
    return 'caf-ads';
  }

  getTrackerVersion() {
    return version;
  }

  getVideoId() {
    if (this.breakClip != null) {
      return this.breakClip.id
    }
    return null
  }

  getTitle() {
    if (this.breakClip != null) {
      return this.breakClip.title
    }
    return null
  }

  getSrc() {
    if (this.breakClip != null) {
      return this.breakClip.contentId
    }
    return null
  }

  getDuration() {
    if (this.breakClip != null) {
      return this.breakClip.duration
    }
    return null
  }

  registerListeners() {
    if (!this.player) return;

    this.player.addEventListener(
      cast.framework.events.EventType.BREAK_STARTED,
      (event) => {
        this.onStarted(event);
      }
    );
    this.player.addEventListener(
      cast.framework.events.EventType.BREAK_ENDED,
      (event) => {
        this.onEnded(event);
      }
    );
    this.player.addEventListener(
      cast.framework.events.EventType.BREAK_CLIP_LOADING,
      (event) => {
        this.onClipLoading(event);
      }
    );
    this.player.addEventListener(
      cast.framework.events.EventType.BREAK_CLIP_STARTED,
      (event) => {
        this.onClipStarted(event);
      }
    );
    this.player.addEventListener(
      cast.framework.events.EventType.BREAK_CLIP_ENDED,
      (event) => {
        this.onClipEnded(event);
      }
    );
  }

  onStarted(ev) {
    nrvideo.Log.debug("onStartedAdBreak  = ", ev)
    this.sendAdBreakStart({ adBreakId: ev.breakId });
  }

  onEnded(ev) {
    nrvideo.Log.debug("onEndedAdBreak  = ", ev)
    this.sendAdBreakEnd({ adBreakId: ev.breakId });
  }

  onClipLoading(ev) {
    nrvideo.Log.debug("onClipLoading  = ", ev)
    this.breakClip = this.player.getBreakManager().getBreakClipById(ev.breakClipId)
    this.sendRequest();
  }

  onClipStarted(ev) {
    nrvideo.Log.debug("onClipStarted  = ", ev)
    this.sendStart();
  }

  onClipEnded(ev) {
    nrvideo.Log.debug("onClipEnded  = ", ev)
    this.sendEnd();
  }
}
