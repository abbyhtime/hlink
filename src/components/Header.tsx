
import { Plus, Settings } from 'lucide-react';

const Header = () => {
  return (
    <div className="flex items-center justify-between p-6 pt-12">
      <div>
        <h1 className="text-2xl font-bold text-lightGray">NetworkPro</h1>
        <p className="text-lightGray/70 text-sm">Grow your connections</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="p-3 rounded-xl bg-lightGray/10 backdrop-blur-sm border border-lightGray/20 hover:bg-lightGray/20 transition-all duration-200">
          <Plus className="w-5 h-5 text-mintGreen" />
        </button>
        <button className="p-3 rounded-xl bg-lightGray/10 backdrop-blur-sm border border-lightGray/20 hover:bg-lightGray/20 transition-all duration-200">
          <Settings className="w-5 h-5 text-lightGray" />
        </button>
      </div>
    </div>
  );
};

export default Header;
