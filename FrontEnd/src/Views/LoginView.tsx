import {Link} from 'react-router-dom';

export default function LoginView() {
  return (
    <>
        <div className='text-blue-500'>LoginView</div>
        <nav>
            <Link to="/auth/register">cuenta</Link>
        </nav>
    </>

  )
}
