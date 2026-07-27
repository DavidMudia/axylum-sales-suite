import {

    QueryClient,

    QueryClientProvider,

} from "@tanstack/react-query";

const client =
    new QueryClient({

        defaultOptions: {

            queries: {

                staleTime:
                    1000 * 60 * 5,

                retry: 1,

                refetchOnWindowFocus:
                    false,

            },

        },

    });

export default function QueryProvider({

    children,

}: {

    children: React.ReactNode;

}) {

    return (

        <QueryClientProvider
            client={client}
        >

            {children}

        </QueryClientProvider>

    );

}