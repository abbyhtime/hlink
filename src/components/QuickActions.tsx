
import { QrCode, UserPlus, Upload, Zap } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: QrCode,
      title: "QR Scan",
      subtitle: "Quick connect",
      color: "from-mintGreen to-mintGreen/70"
    },
    {
      icon: UserPlus,
      title: "Invite",
      subtitle: "Send invite",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Upload,
      title: "Import",
      subtitle: "CSV upload",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Sync",
      subtitle: "Auto connect",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="mx-6 mb-8 animate-fade-in">
      <h2 className="text-lg font-semibold text-lightGray mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.title}
              className="glass-card p-4 hover:bg-lightGray/15 transition-all duration-200 transform hover:scale-105 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lightGray text-sm">{action.title}</h3>
              <p className="text-xs text-lightGray/70">{action.subtitle}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
