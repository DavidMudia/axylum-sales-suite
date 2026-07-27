import SidebarItem from "./SidebarItem";
import { useAuth } from "../../context/AuthContext";
import type { NavigationItem } from "./navigation";


type Props = {

  title: string;

  items: NavigationItem[];

  collapsed: boolean;

};



export default function SidebarSection({
  title,
  items,
  collapsed,
}: Props) {


  const {
    hasPermission,
  } = useAuth();



  function canView(
    item: NavigationItem
  ) {

    if (!item.permission) {
      return true;
    }


    return hasPermission(
      item.permission
    );

  }




  const visibleItems =
    items.filter((item) => {


      // item has children
      if (
        item.children &&
        item.children.length > 0
      ) {

        return item.children.some(
          child =>
            canView(child)
        );

      }


      return canView(item);

    });




  if (
    visibleItems.length === 0
  ) {

    return null;

  }




  return (

    <div
      className="
        mb-6
      "
    >


      {!collapsed && (

        <p
          className="
            mb-2
            px-4
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          {title}
        </p>

      )}






      <div
        className="
          space-y-1
        "
      >


        {
          visibleItems.map(
            (item) => (


              <div
                key={item.title}
              >


                {
                  item.children
                  ?
                  (

                    item.children
                    .filter(child =>
                      canView(child)
                    )
                    .map(child => (

                      <SidebarItem

                        key={
                          child.path
                        }

                        icon={
                          child.icon
                        }

                        title={
                          child.title
                        }

                        path={
                          child.path!
                        }

                        collapsed={
                          collapsed
                        }

                      />

                    ))

                  )

                  :

                  (

                    <SidebarItem

                      key={
                        item.path
                      }

                      icon={
                        item.icon
                      }

                      title={
                        item.title
                      }

                      path={
                        item.path!
                      }

                      collapsed={
                        collapsed
                      }

                    />

                  )

                }


              </div>


            )
          )
        }



      </div>


    </div>

  );

}