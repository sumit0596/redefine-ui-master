declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: any;
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: { scale?: number };
    jsPDF?: {
      unit?: string;
      format?: any | [number, number];
      orientation?: string;
    };
  }

  interface Html2Pdf {
    from(element: HTMLElement): Html2Pdf;
    set(options: Html2PdfOptions): Html2Pdf;
    save(): void;
  }

  const html2pdf: {
    (): Html2Pdf;
    from: (element: HTMLElement) => Html2Pdf;
  };

  export default html2pdf;
}
