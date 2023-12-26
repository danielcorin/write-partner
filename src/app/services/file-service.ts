class FlieService {
    downloadStringAsFile(content: string, contentType: string) {
        const filename = `document-${new Date().getTime()}.md`
        // Create a Blob from the content
        const blob = new Blob([content], { type: contentType })
        const url = window.URL.createObjectURL(blob)

        // Create a link element
        const downloadLink = document.createElement('a')

        // Set the attributes and force triggering download
        downloadLink.href = url
        downloadLink.download = filename
        downloadLink.click() // Simulate click to start download

        // Clean up by revoking the Object URL
        window.URL.revokeObjectURL(url)
      }
}

const fileServiceInstance = new FlieService();
export default fileServiceInstance;
