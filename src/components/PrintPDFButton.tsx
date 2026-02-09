import { Printer } from 'lucide-react';

interface PrintPDFButtonProps {
  className?: string;
}

export default function PrintPDFButton({ className = '' }: PrintPDFButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={`flex flex-col items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 print:hidden ${className}`}
      title="Imprimir PDF / Print to PDF"
    >
      <Printer className="w-6 h-6 mb-1" />
      <span className="text-[10px] font-black uppercase tracking-widest">PDF</span>
    </button>
  );
}
