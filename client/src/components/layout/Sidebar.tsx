import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { navigation } from "./navigation";
import SidebarSection from "./SidebarSection";


type Props = {
  open: boolean;

  collapsed: boolean;

  setCollapsed: (
    value: boolean
  ) => void;

  onClose: () => void;
};


export default function Sidebar({
  open,
  collapsed,
  setCollapsed,
  onClose,
}: Props) {


  return (
    <>

      {open && (
        <div
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            lg:hidden
          "
        />
      )}



      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          flex-col
          bg-slate-950
          border-r
          border-slate-800
          transition-all
          duration-300

          ${
            collapsed
              ? "w-20"
              : "w-72"
          }

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >


        {/* Logo */}

        <div
          className="
            flex
            h-16
            items-center
            justify-between
            border-b
            border-slate-800
            px-5
          "
        >


          {!collapsed && (

            <div>

              <h1
                className="
                  text-lg
                  font-bold
                  tracking-[0.25em]
                  text-white
                "
              >
                AXYLUM
              </h1>


              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                Sales Suite ERP
              </p>

            </div>

          )}



          <button
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="
              hidden
              rounded-lg
              p-2
              text-slate-400
              hover:bg-slate-800
              hover:text-white
              lg:block
            "
          >

            {
              collapsed
                ? (
                    <ChevronRight
                      size={18}
                    />
                  )
                : (
                    <ChevronLeft
                      size={18}
                    />
                  )
            }

          </button>



          <button
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-slate-400
              hover:bg-slate-800
              lg:hidden
            "
          >

            <X size={18}/>

          </button>


        </div>




        {/* Navigation */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-3
            py-5
          "
        >

          {
            navigation.map(
              (section) => (

                <SidebarSection

                  key={
                    section.title
                  }

                  title={
                    section.title
                  }

                  items={
                    section.children ?? []
                  }

                  collapsed={
                    collapsed
                  }

                />

              )
            )
          }


        </div>





        {!collapsed && (

          <div
            className="
              border-t
              border-slate-800
              p-4
            "
          >

            <p
              className="
                text-xs
                text-slate-500
              "
            >
              Axylum ERP
            </p>


            <p
              className="
                text-xs
                text-slate-600
              "
            >
              Version 1.0.0
            </p>


          </div>

        )}


      </aside>


    </>
  );
}