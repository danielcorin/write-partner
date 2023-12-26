class ClipboardService {
    async copyToClipboard(text: string) {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        console.error('Clipboard API not available.')
      }
    }
}

const clipboardServiceInstance = new ClipboardService();
export default clipboardServiceInstance;
