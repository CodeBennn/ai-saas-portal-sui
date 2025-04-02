import "@mysten/dapp-kit/dist/index.css";

// import SlideInMenu from "./slideInMenu";
// import RpcSetting from "./rpcSetting";

const Header = () => {

  return (
    <div
      className="fixed top-0 left-0 w-full backdrop-blur-md"
      style={{
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 1000,
      }}
    >
      <header className="w-full max-w-360 mx-auto h-20 flex items-center justify-between pt-5 pb-3 px-4 shadow-xl">
        {/* Logo Link */}
        <span className="text-sm sm:text-sm md:text-lg lg:text-4xl font-extrabold">
          TaiShang AI SaaS System
        </span>
      </header>
    </div>
  );
};

export default Header;
