// @ts-ignore
import PDFParser from 'pdf2json'

const pdfParser = new PDFParser()

export const readPDF = (path: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (error: any) => reject(error.parserError))
    pdfParser.on("pdfParser_dataReady", (data: any) => resolve(data))
    pdfParser.loadPDF(path)
  })
}