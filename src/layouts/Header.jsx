import { Outlet } from 'react-router-dom';
import { ModeToggle } from '../components/mood-toggle'

const Header = () => {
  return (
    <div className='h-screen w-full box-border'>
      <header className="px-8 py-4 flex justify-between items-center w-full z-50">
        <span className="text-lg sm:text-2xl lg:text-3xl font-semibold tracking-wider text-orange-500">
          AlgoMate
        </span>
         <ModeToggle/>
      </header>
        <Outlet />
    </div>
  );
};

export default Header;
