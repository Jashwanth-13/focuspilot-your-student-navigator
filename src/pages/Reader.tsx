import { useState } from "react"

export default function Reader() {
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")

  const calculateWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0
  }

  const handleFile = async (file: File) => {
    setFileName(file.name)

    // 🔒 File validation
    if (file.size > 5 * 1024 * 1024) {
      setContent("❌ File too large (max 5MB)")
      return
    }

    setLoading(true)

    try {
      // 📄 TXT FILE
      if (file.name.endsWith(".txt")) {
        const text = await file.text()
        setContent(text)
        setWordCount(calculateWordCount(text))
      }

      // 📄 PDF FILE
      else if (file.name.endsWith(".pdf")) {
        // ✅ Correct modern import
        const pdfjsLib = await import("pdfjs-dist")

        // ✅ Proper Vite worker handling
        const worker = (await import("pdfjs-dist/build/pdf.worker.min?url")).default
        pdfjsLib.GlobalWorkerOptions.workerSrc = worker

        const arrayBuffer = await file.arrayBuffer()

        const pdf = await pdfjsLib.getDocument({
          data: arrayBuffer,
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
        setWordCount(calculateWordCount(text))
      }

      else {
        setContent("❌ Unsupported file type")
      }
    } catch (err: any) {
      console.error("PDF ERROR:", err?.message || err)
      setContent("❌ Error reading file")
    }

    setLoading(false)
  }

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold">
        📄 Document Reader
      </h1>

      <input
        type="file"
        accept=".txt,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {fileName && (
        <div className="text-sm text-gray-600">
          File: {fileName}
        </div>
      )}

      {loading && (
        <div className="text-blue-500">
          ⏳ Reading file...
        </div>
      )}

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
