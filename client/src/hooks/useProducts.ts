import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStats,
} from "../api/product";

export function useProducts(
    search: string,
    page: number
) {
    return useQuery({
        queryKey:["products",search,page],
        queryFn:()=>getProducts(search,page),
    });
}

export function useProductStats(){
    return useQuery({
        queryKey:["product-stats"],
        queryFn:getProductStats,
    });
}

export function useCreateProduct(){

    const qc=useQueryClient();

    return useMutation({

        mutationFn:createProduct,

        onSuccess(){
            qc.invalidateQueries({
                queryKey:["products"]
            });

            qc.invalidateQueries({
                queryKey:["product-stats"]
            });
        }

    });

}

export function useUpdateProduct(){

    const qc=useQueryClient();

    return useMutation({

        mutationFn:({id,data}:{id:number,data:any})=>
            updateProduct(id,data),

        onSuccess(){

            qc.invalidateQueries({
                queryKey:["products"]
            });

        }

    });

}

export function useDeleteProduct(){

    const qc=useQueryClient();

    return useMutation({

        mutationFn:deleteProduct,

        onSuccess(){

            qc.invalidateQueries({
                queryKey:["products"]
            });

            qc.invalidateQueries({
                queryKey:["product-stats"]
            });

        }

    });

}