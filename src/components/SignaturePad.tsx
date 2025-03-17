'use client'

import { useRef, useState } from 'react'

import ReactSignatureCanvas from 'react-signature-canvas'

const SignaturePad: React.FC = () => {
  const sigCanvas = useRef<ReactSignatureCanvas>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)

  // Xóa chữ ký
  const clearSignature = () => {
    sigCanvas.current?.clear()
    setImageURL(null)
  }

  // Lưu chữ ký dưới dạng hình ảnh
  const saveSignature = () => {
    if (sigCanvas.current) {
      setImageURL(sigCanvas.current.toDataURL('image/png'))
    }
  }

  return (
    <div className='flex flex-col items-center space-y-4 p-4'>
      <h2 className='text-xl font-semibold'>Chữ ký điện tử</h2>

      <div className='border border-gray-400 rounded-md w-[400px] h-[200px]'>
        <ReactSignatureCanvas
          ref={sigCanvas}
          penColor='black'
          canvasProps={{ width: 400, height: 200, className: 'sigCanvas' }}
        />
      </div>

      <div className='flex space-x-4'>
        <button onClick={clearSignature} className='bg-red-500 text-white px-4 py-2 rounded-md'>
          Xóa
        </button>
        <button onClick={saveSignature} className='bg-blue-500 text-white px-4 py-2 rounded-md'>
          Lưu
        </button>
      </div>

      {imageURL && (
        <div>
          <h3 className='text-lg font-medium'>Chữ ký đã lưu:</h3>
          <img src={imageURL} alt='Chữ ký' className='border border-gray-400 mt-2' />
        </div>
      )}
    </div>
  )
}

export default SignaturePad
