"use client"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()

  return (
    <div >
      <div  onClick={() => router.push('/road-map')}>
        Road map
      </div>
      <div  onClick={() => router.push('/progress-bar')}>ProgressBar</div>
    </div>
  );
}


 
