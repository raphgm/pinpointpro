declare namespace JSX {
  interface IntrinsicElements {
    webview: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { src?: string },
      HTMLElement
    >;
  }
}

interface Window {
  pinpoint?: { isElectron: boolean };
}
