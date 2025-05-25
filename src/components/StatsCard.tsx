
const StatsCard = () => {
  return (
    <div className="mx-6 mb-8 animate-fade-in">
      <div className="glass-card p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-mintGreen">142</div>
            <div className="text-sm text-lightGray/70">Connections</div>
          </div>
          <div className="text-center border-x border-lightGray/20">
            <div className="text-2xl font-bold text-mintGreen">28</div>
            <div className="text-sm text-lightGray/70">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-mintGreen">95%</div>
            <div className="text-sm text-lightGray/70">Accept Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
