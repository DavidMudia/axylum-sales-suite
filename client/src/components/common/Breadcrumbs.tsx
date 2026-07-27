import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {

    const { pathname } = useLocation();

    const paths =
        pathname
            .split("/")
            .filter(Boolean);

    return (

        <div className="flex items-center gap-2 text-sm">

            <span className="text-gray-400">
                Home
            </span>

            {

                paths.map((item, index) => (

                    <div
                        key={index}
                        className="flex items-center gap-2"
                    >

                        <ChevronRight size={14}/>

                        <span className="capitalize">

                            {

                                item.replaceAll("-", " ")

                            }

                        </span>

                    </div>

                ))

            }

        </div>

    );

}