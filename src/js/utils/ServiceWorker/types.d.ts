interface AppInstallOptions {
  /**
   * A function running when `beforeinstallprompt` is captured.
   */
  initPrompt: Function;

  /**
   * A function running when the website is installed.
   */
  onInstall: Function;
}

/**
 * The `beforeinstallprompt` event is fired at the
 * `Window.onbeforeinstallprompt` handler before
 * a user is prompted to “install” a website.
 *
 * @deprecated Only supported on Chromium and Android Webview.
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * An array of `DOMString` items containing the platforms on which the event
   * was dispatched. This is provided for user agents that want to present
   * to present a choice of versions to the user such as “web” or “play”
   * which would allow the user to chose between a web version or an
   * Android version.
   */
  readonly platforms: Array<string>;

  /**
   * A Promise that resolves to a `DOMString` with the user choice.
   */
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  /**
   * Show the install prompt.
   */
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
