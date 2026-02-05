import {Outlet} from 'react-router-dom';
import {Toaster} from 'sonner'
import Logo from '../components/Logo';

export default function AuthLayout() {
  return (
    <>
        <Toaster position='top-right' richColors/>
        <div className='bg-slate-800 min-h-screen'>
            <div className='max-w-lg mx-auto pt-10 px-5'>
                <Logo/>

            <div className='py-10'>
                <Outlet/>
            </div>
          </div>
        </div>
    </>
  )
}
