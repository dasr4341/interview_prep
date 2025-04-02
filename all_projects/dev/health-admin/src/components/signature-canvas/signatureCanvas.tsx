import { useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import './signatureCanvas.scss';

export function SignatureCanvasComponent({ 
  seSignatureBase64,
  functionalityOff = false
}: {
  seSignatureBase64: (value: string) => void;
  functionalityOff:boolean;
}) {
  const Ref: any = useRef({});

  function trim() {
    const base64Url = Ref.current.getTrimmedCanvas().toDataURL('image/png');
    seSignatureBase64(base64Url.toString());
  }

  function clear() {
    Ref.current.clear();
    seSignatureBase64('');
  }

  function permission() {
    if (functionalityOff) {
      Ref.current.off();
  }
    
  }

  return (
    <div className="container flex flex-col">
      <SignaturePad
        penColor="black"
        backgroundColor="white"
        canvasProps={{ className: 'sigCanvas' }}
        ref={Ref}
        onEnd={trim}
        onBegin={permission}
      />
      {
        functionalityOff === false && (
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 my-2 rounded inline-flex items-center"
            onClick={clear}
            style={{ width: 76 }}>
            Clear
          </button>
        )
      }
      
    </div>
  );
}
