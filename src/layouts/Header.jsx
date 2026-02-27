import { Outlet } from 'react-router-dom';
import { ModeToggle } from '../components/mood-toggle';

const Header = () => {
  return (
    <div className="w-full">
      <header className="px-8 fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-[60px] bg-green-100/10 backdrop-blur-md">
        <span className="text-lg sm:text-2xl lg:text-3xl font-semibold tracking-wider text-orange-500 font-mono">
          {"<>AlgoMate"}
        </span>
        <ModeToggle />
      </header>
      <main className="pt-[60px]">
        <Outlet />
      </main>
    </div>
  );
};

export default Header;
