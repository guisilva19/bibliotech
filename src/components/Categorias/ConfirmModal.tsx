import { HiX, HiExclamation } from 'react-icons/hi';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'rgba(247, 234, 217, 0.98)',
          border: '1px solid rgba(225, 210, 169, 0.5)'
        }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="p-2 rounded-lg shrink-0"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)'
            }}
          >
            <HiExclamation className="w-6 h-6" style={{ color: '#ef4444' }} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#67594e' }}>
              {title}
            </h2>
            <p className="text-sm" style={{ color: 'rgba(103, 89, 78, 0.8)' }}>
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'rgba(103, 89, 78, 0.6)' }}
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor: 'rgba(103, 89, 78, 0.1)',
              color: '#67594e',
              border: '1px solid rgba(103, 89, 78, 0.2)'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-all duration-200"
            style={{ backgroundColor: '#ef4444' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}





