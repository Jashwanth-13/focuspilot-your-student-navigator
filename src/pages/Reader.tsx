import { useState } from "react"

export default function Reader() {
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)

  const handleFile = async (file: File) => {
    if (file.name.endsWith(".txt")) {
      const text = await file.text()

      setContent(text)

      const wc = text.split(/\s+/).filter(Boolean).length
      setWordCount(wc)
    }

    else if (file.name.endsWith(".pdf")) {
      try {

        // FIXED IMPORT (important for Vite)
        const pdfjsLib = await import(
          "pdfjs-dist/legacy/build/pdf"
        )

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

        const arrayBuffer = await file.arrayBuffer()

        const pdf = await pdfjsLib.getDocument({
          data: arrayBuffer
        }).promise

        let text = ""

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)

          const tc = await page.getTextContent()

          text += tc.items
            .map((item: any) => item.str)
            .join(" ")

          text += "\n\n"
        }

        setContent(text)

        const wc = text.split(/\s+/).filter(Boolean).length

        setWordCount(wc)

      } catch (err) {
        console.error(err)

        setContent(
          "Error reading PDF file. Try another file."
        )
      }
    }
  }

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">
        Document Reader
      </h1>

      <input
        type="file"
        accept=".txt,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0]

          if (file) {
            handleFile(file)
          }
        }}
      />

      <div className="text-sm text-gray-500">
        Word Count: {wordCount}
      </div>

      <textarea
        className="w-full h-[400px] border rounded-lg p-4"
        value={content}
        readOnly
      />

    </div>
  )
}
