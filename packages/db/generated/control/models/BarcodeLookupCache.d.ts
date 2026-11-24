import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model BarcodeLookupCache
 *
 */
export type BarcodeLookupCacheModel = runtime.Types.Result.DefaultSelection<Prisma.$BarcodeLookupCachePayload>;
export type AggregateBarcodeLookupCache = {
    _count: BarcodeLookupCacheCountAggregateOutputType | null;
    _min: BarcodeLookupCacheMinAggregateOutputType | null;
    _max: BarcodeLookupCacheMaxAggregateOutputType | null;
};
export type BarcodeLookupCacheMinAggregateOutputType = {
    barcode: string | null;
    source: string | null;
    fetchedAt: Date | null;
    expiresAt: Date | null;
};
export type BarcodeLookupCacheMaxAggregateOutputType = {
    barcode: string | null;
    source: string | null;
    fetchedAt: Date | null;
    expiresAt: Date | null;
};
export type BarcodeLookupCacheCountAggregateOutputType = {
    barcode: number;
    payload: number;
    source: number;
    fetchedAt: number;
    expiresAt: number;
    _all: number;
};
export type BarcodeLookupCacheMinAggregateInputType = {
    barcode?: true;
    source?: true;
    fetchedAt?: true;
    expiresAt?: true;
};
export type BarcodeLookupCacheMaxAggregateInputType = {
    barcode?: true;
    source?: true;
    fetchedAt?: true;
    expiresAt?: true;
};
export type BarcodeLookupCacheCountAggregateInputType = {
    barcode?: true;
    payload?: true;
    source?: true;
    fetchedAt?: true;
    expiresAt?: true;
    _all?: true;
};
export type BarcodeLookupCacheAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which BarcodeLookupCache to aggregate.
     */
    where?: Prisma.BarcodeLookupCacheWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BarcodeLookupCaches to fetch.
     */
    orderBy?: Prisma.BarcodeLookupCacheOrderByWithRelationInput | Prisma.BarcodeLookupCacheOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.BarcodeLookupCacheWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BarcodeLookupCaches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BarcodeLookupCaches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BarcodeLookupCaches
    **/
    _count?: true | BarcodeLookupCacheCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: BarcodeLookupCacheMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: BarcodeLookupCacheMaxAggregateInputType;
};
export type GetBarcodeLookupCacheAggregateType<T extends BarcodeLookupCacheAggregateArgs> = {
    [P in keyof T & keyof AggregateBarcodeLookupCache]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBarcodeLookupCache[P]> : Prisma.GetScalarType<T[P], AggregateBarcodeLookupCache[P]>;
};
export type BarcodeLookupCacheGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BarcodeLookupCacheWhereInput;
    orderBy?: Prisma.BarcodeLookupCacheOrderByWithAggregationInput | Prisma.BarcodeLookupCacheOrderByWithAggregationInput[];
    by: Prisma.BarcodeLookupCacheScalarFieldEnum[] | Prisma.BarcodeLookupCacheScalarFieldEnum;
    having?: Prisma.BarcodeLookupCacheScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BarcodeLookupCacheCountAggregateInputType | true;
    _min?: BarcodeLookupCacheMinAggregateInputType;
    _max?: BarcodeLookupCacheMaxAggregateInputType;
};
export type BarcodeLookupCacheGroupByOutputType = {
    barcode: string;
    payload: runtime.JsonValue;
    source: string;
    fetchedAt: Date;
    expiresAt: Date;
    _count: BarcodeLookupCacheCountAggregateOutputType | null;
    _min: BarcodeLookupCacheMinAggregateOutputType | null;
    _max: BarcodeLookupCacheMaxAggregateOutputType | null;
};
export type GetBarcodeLookupCacheGroupByPayload<T extends BarcodeLookupCacheGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BarcodeLookupCacheGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BarcodeLookupCacheGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BarcodeLookupCacheGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BarcodeLookupCacheGroupByOutputType[P]>;
}>>;
export type BarcodeLookupCacheWhereInput = {
    AND?: Prisma.BarcodeLookupCacheWhereInput | Prisma.BarcodeLookupCacheWhereInput[];
    OR?: Prisma.BarcodeLookupCacheWhereInput[];
    NOT?: Prisma.BarcodeLookupCacheWhereInput | Prisma.BarcodeLookupCacheWhereInput[];
    barcode?: Prisma.StringFilter<"BarcodeLookupCache"> | string;
    payload?: Prisma.JsonFilter<"BarcodeLookupCache">;
    source?: Prisma.StringFilter<"BarcodeLookupCache"> | string;
    fetchedAt?: Prisma.DateTimeFilter<"BarcodeLookupCache"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"BarcodeLookupCache"> | Date | string;
};
export type BarcodeLookupCacheOrderByWithRelationInput = {
    barcode?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type BarcodeLookupCacheWhereUniqueInput = Prisma.AtLeast<{
    barcode?: string;
    AND?: Prisma.BarcodeLookupCacheWhereInput | Prisma.BarcodeLookupCacheWhereInput[];
    OR?: Prisma.BarcodeLookupCacheWhereInput[];
    NOT?: Prisma.BarcodeLookupCacheWhereInput | Prisma.BarcodeLookupCacheWhereInput[];
    payload?: Prisma.JsonFilter<"BarcodeLookupCache">;
    source?: Prisma.StringFilter<"BarcodeLookupCache"> | string;
    fetchedAt?: Prisma.DateTimeFilter<"BarcodeLookupCache"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"BarcodeLookupCache"> | Date | string;
}, "barcode">;
export type BarcodeLookupCacheOrderByWithAggregationInput = {
    barcode?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    _count?: Prisma.BarcodeLookupCacheCountOrderByAggregateInput;
    _max?: Prisma.BarcodeLookupCacheMaxOrderByAggregateInput;
    _min?: Prisma.BarcodeLookupCacheMinOrderByAggregateInput;
};
export type BarcodeLookupCacheScalarWhereWithAggregatesInput = {
    AND?: Prisma.BarcodeLookupCacheScalarWhereWithAggregatesInput | Prisma.BarcodeLookupCacheScalarWhereWithAggregatesInput[];
    OR?: Prisma.BarcodeLookupCacheScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BarcodeLookupCacheScalarWhereWithAggregatesInput | Prisma.BarcodeLookupCacheScalarWhereWithAggregatesInput[];
    barcode?: Prisma.StringWithAggregatesFilter<"BarcodeLookupCache"> | string;
    payload?: Prisma.JsonWithAggregatesFilter<"BarcodeLookupCache">;
    source?: Prisma.StringWithAggregatesFilter<"BarcodeLookupCache"> | string;
    fetchedAt?: Prisma.DateTimeWithAggregatesFilter<"BarcodeLookupCache"> | Date | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"BarcodeLookupCache"> | Date | string;
};
export type BarcodeLookupCacheCreateInput = {
    barcode: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    source: string;
    fetchedAt?: Date | string;
    expiresAt: Date | string;
};
export type BarcodeLookupCacheUncheckedCreateInput = {
    barcode: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    source: string;
    fetchedAt?: Date | string;
    expiresAt: Date | string;
};
export type BarcodeLookupCacheUpdateInput = {
    barcode?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BarcodeLookupCacheUncheckedUpdateInput = {
    barcode?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BarcodeLookupCacheCreateManyInput = {
    barcode: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    source: string;
    fetchedAt?: Date | string;
    expiresAt: Date | string;
};
export type BarcodeLookupCacheUpdateManyMutationInput = {
    barcode?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BarcodeLookupCacheUncheckedUpdateManyInput = {
    barcode?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BarcodeLookupCacheCountOrderByAggregateInput = {
    barcode?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type BarcodeLookupCacheMaxOrderByAggregateInput = {
    barcode?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type BarcodeLookupCacheMinOrderByAggregateInput = {
    barcode?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type BarcodeLookupCacheSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    barcode?: boolean;
    payload?: boolean;
    source?: boolean;
    fetchedAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["barcodeLookupCache"]>;
export type BarcodeLookupCacheSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    barcode?: boolean;
    payload?: boolean;
    source?: boolean;
    fetchedAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["barcodeLookupCache"]>;
export type BarcodeLookupCacheSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    barcode?: boolean;
    payload?: boolean;
    source?: boolean;
    fetchedAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["barcodeLookupCache"]>;
export type BarcodeLookupCacheSelectScalar = {
    barcode?: boolean;
    payload?: boolean;
    source?: boolean;
    fetchedAt?: boolean;
    expiresAt?: boolean;
};
export type BarcodeLookupCacheOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"barcode" | "payload" | "source" | "fetchedAt" | "expiresAt", ExtArgs["result"]["barcodeLookupCache"]>;
export type $BarcodeLookupCachePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BarcodeLookupCache";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        barcode: string;
        payload: runtime.JsonValue;
        source: string;
        fetchedAt: Date;
        expiresAt: Date;
    }, ExtArgs["result"]["barcodeLookupCache"]>;
    composites: {};
};
export type BarcodeLookupCacheGetPayload<S extends boolean | null | undefined | BarcodeLookupCacheDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload, S>;
export type BarcodeLookupCacheCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BarcodeLookupCacheFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BarcodeLookupCacheCountAggregateInputType | true;
};
export interface BarcodeLookupCacheDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BarcodeLookupCache'];
        meta: {
            name: 'BarcodeLookupCache';
        };
    };
    /**
     * Find zero or one BarcodeLookupCache that matches the filter.
     * @param {BarcodeLookupCacheFindUniqueArgs} args - Arguments to find a BarcodeLookupCache
     * @example
     * // Get one BarcodeLookupCache
     * const barcodeLookupCache = await prisma.barcodeLookupCache.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BarcodeLookupCacheFindUniqueArgs>(args: Prisma.SelectSubset<T, BarcodeLookupCacheFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BarcodeLookupCacheClient<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one BarcodeLookupCache that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BarcodeLookupCacheFindUniqueOrThrowArgs} args - Arguments to find a BarcodeLookupCache
     * @example
     * // Get one BarcodeLookupCache
     * const barcodeLookupCache = await prisma.barcodeLookupCache.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BarcodeLookupCacheFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BarcodeLookupCacheFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BarcodeLookupCacheClient<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first BarcodeLookupCache that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeLookupCacheFindFirstArgs} args - Arguments to find a BarcodeLookupCache
     * @example
     * // Get one BarcodeLookupCache
     * const barcodeLookupCache = await prisma.barcodeLookupCache.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BarcodeLookupCacheFindFirstArgs>(args?: Prisma.SelectSubset<T, BarcodeLookupCacheFindFirstArgs<ExtArgs>>): Prisma.Prisma__BarcodeLookupCacheClient<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first BarcodeLookupCache that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeLookupCacheFindFirstOrThrowArgs} args - Arguments to find a BarcodeLookupCache
     * @example
     * // Get one BarcodeLookupCache
     * const barcodeLookupCache = await prisma.barcodeLookupCache.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BarcodeLookupCacheFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BarcodeLookupCacheFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BarcodeLookupCacheClient<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more BarcodeLookupCaches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeLookupCacheFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BarcodeLookupCaches
     * const barcodeLookupCaches = await prisma.barcodeLookupCache.findMany()
     *
     * // Get first 10 BarcodeLookupCaches
     * const barcodeLookupCaches = await prisma.barcodeLookupCache.findMany({ take: 10 })
     *
     * // Only select the `barcode`
     * const barcodeLookupCacheWithBarcodeOnly = await prisma.barcodeLookupCache.findMany({ select: { barcode: true } })
     *
     */
    findMany<T extends BarcodeLookupCacheFindManyArgs>(args?: Prisma.SelectSubset<T, BarcodeLookupCacheFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a BarcodeLookupCache.
     * @param {BarcodeLookupCacheCreateArgs} args - Arguments to create a BarcodeLookupCache.
     * @example
     * // Create one BarcodeLookupCache
     * const BarcodeLookupCache = await prisma.barcodeLookupCache.create({
     *   data: {
     *     // ... data to create a BarcodeLookupCache
     *   }
     * })
     *
     */
    create<T extends BarcodeLookupCacheCreateArgs>(args: Prisma.SelectSubset<T, BarcodeLookupCacheCreateArgs<ExtArgs>>): Prisma.Prisma__BarcodeLookupCacheClient<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many BarcodeLookupCaches.
     * @param {BarcodeLookupCacheCreateManyArgs} args - Arguments to create many BarcodeLookupCaches.
     * @example
     * // Create many BarcodeLookupCaches
     * const barcodeLookupCache = await prisma.barcodeLookupCache.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BarcodeLookupCacheCreateManyArgs>(args?: Prisma.SelectSubset<T, BarcodeLookupCacheCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many BarcodeLookupCaches and returns the data saved in the database.
     * @param {BarcodeLookupCacheCreateManyAndReturnArgs} args - Arguments to create many BarcodeLookupCaches.
     * @example
     * // Create many BarcodeLookupCaches
     * const barcodeLookupCache = await prisma.barcodeLookupCache.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many BarcodeLookupCaches and only return the `barcode`
     * const barcodeLookupCacheWithBarcodeOnly = await prisma.barcodeLookupCache.createManyAndReturn({
     *   select: { barcode: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends BarcodeLookupCacheCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BarcodeLookupCacheCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a BarcodeLookupCache.
     * @param {BarcodeLookupCacheDeleteArgs} args - Arguments to delete one BarcodeLookupCache.
     * @example
     * // Delete one BarcodeLookupCache
     * const BarcodeLookupCache = await prisma.barcodeLookupCache.delete({
     *   where: {
     *     // ... filter to delete one BarcodeLookupCache
     *   }
     * })
     *
     */
    delete<T extends BarcodeLookupCacheDeleteArgs>(args: Prisma.SelectSubset<T, BarcodeLookupCacheDeleteArgs<ExtArgs>>): Prisma.Prisma__BarcodeLookupCacheClient<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one BarcodeLookupCache.
     * @param {BarcodeLookupCacheUpdateArgs} args - Arguments to update one BarcodeLookupCache.
     * @example
     * // Update one BarcodeLookupCache
     * const barcodeLookupCache = await prisma.barcodeLookupCache.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BarcodeLookupCacheUpdateArgs>(args: Prisma.SelectSubset<T, BarcodeLookupCacheUpdateArgs<ExtArgs>>): Prisma.Prisma__BarcodeLookupCacheClient<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more BarcodeLookupCaches.
     * @param {BarcodeLookupCacheDeleteManyArgs} args - Arguments to filter BarcodeLookupCaches to delete.
     * @example
     * // Delete a few BarcodeLookupCaches
     * const { count } = await prisma.barcodeLookupCache.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BarcodeLookupCacheDeleteManyArgs>(args?: Prisma.SelectSubset<T, BarcodeLookupCacheDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more BarcodeLookupCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeLookupCacheUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BarcodeLookupCaches
     * const barcodeLookupCache = await prisma.barcodeLookupCache.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BarcodeLookupCacheUpdateManyArgs>(args: Prisma.SelectSubset<T, BarcodeLookupCacheUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more BarcodeLookupCaches and returns the data updated in the database.
     * @param {BarcodeLookupCacheUpdateManyAndReturnArgs} args - Arguments to update many BarcodeLookupCaches.
     * @example
     * // Update many BarcodeLookupCaches
     * const barcodeLookupCache = await prisma.barcodeLookupCache.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more BarcodeLookupCaches and only return the `barcode`
     * const barcodeLookupCacheWithBarcodeOnly = await prisma.barcodeLookupCache.updateManyAndReturn({
     *   select: { barcode: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends BarcodeLookupCacheUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BarcodeLookupCacheUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one BarcodeLookupCache.
     * @param {BarcodeLookupCacheUpsertArgs} args - Arguments to update or create a BarcodeLookupCache.
     * @example
     * // Update or create a BarcodeLookupCache
     * const barcodeLookupCache = await prisma.barcodeLookupCache.upsert({
     *   create: {
     *     // ... data to create a BarcodeLookupCache
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BarcodeLookupCache we want to update
     *   }
     * })
     */
    upsert<T extends BarcodeLookupCacheUpsertArgs>(args: Prisma.SelectSubset<T, BarcodeLookupCacheUpsertArgs<ExtArgs>>): Prisma.Prisma__BarcodeLookupCacheClient<runtime.Types.Result.GetResult<Prisma.$BarcodeLookupCachePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of BarcodeLookupCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeLookupCacheCountArgs} args - Arguments to filter BarcodeLookupCaches to count.
     * @example
     * // Count the number of BarcodeLookupCaches
     * const count = await prisma.barcodeLookupCache.count({
     *   where: {
     *     // ... the filter for the BarcodeLookupCaches we want to count
     *   }
     * })
    **/
    count<T extends BarcodeLookupCacheCountArgs>(args?: Prisma.Subset<T, BarcodeLookupCacheCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BarcodeLookupCacheCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a BarcodeLookupCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeLookupCacheAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BarcodeLookupCacheAggregateArgs>(args: Prisma.Subset<T, BarcodeLookupCacheAggregateArgs>): Prisma.PrismaPromise<GetBarcodeLookupCacheAggregateType<T>>;
    /**
     * Group by BarcodeLookupCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeLookupCacheGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends BarcodeLookupCacheGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BarcodeLookupCacheGroupByArgs['orderBy'];
    } : {
        orderBy?: BarcodeLookupCacheGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BarcodeLookupCacheGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBarcodeLookupCacheGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the BarcodeLookupCache model
     */
    readonly fields: BarcodeLookupCacheFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for BarcodeLookupCache.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__BarcodeLookupCacheClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the BarcodeLookupCache model
 */
export interface BarcodeLookupCacheFieldRefs {
    readonly barcode: Prisma.FieldRef<"BarcodeLookupCache", 'String'>;
    readonly payload: Prisma.FieldRef<"BarcodeLookupCache", 'Json'>;
    readonly source: Prisma.FieldRef<"BarcodeLookupCache", 'String'>;
    readonly fetchedAt: Prisma.FieldRef<"BarcodeLookupCache", 'DateTime'>;
    readonly expiresAt: Prisma.FieldRef<"BarcodeLookupCache", 'DateTime'>;
}
/**
 * BarcodeLookupCache findUnique
 */
export type BarcodeLookupCacheFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * Filter, which BarcodeLookupCache to fetch.
     */
    where: Prisma.BarcodeLookupCacheWhereUniqueInput;
};
/**
 * BarcodeLookupCache findUniqueOrThrow
 */
export type BarcodeLookupCacheFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * Filter, which BarcodeLookupCache to fetch.
     */
    where: Prisma.BarcodeLookupCacheWhereUniqueInput;
};
/**
 * BarcodeLookupCache findFirst
 */
export type BarcodeLookupCacheFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * Filter, which BarcodeLookupCache to fetch.
     */
    where?: Prisma.BarcodeLookupCacheWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BarcodeLookupCaches to fetch.
     */
    orderBy?: Prisma.BarcodeLookupCacheOrderByWithRelationInput | Prisma.BarcodeLookupCacheOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BarcodeLookupCaches.
     */
    cursor?: Prisma.BarcodeLookupCacheWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BarcodeLookupCaches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BarcodeLookupCaches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BarcodeLookupCaches.
     */
    distinct?: Prisma.BarcodeLookupCacheScalarFieldEnum | Prisma.BarcodeLookupCacheScalarFieldEnum[];
};
/**
 * BarcodeLookupCache findFirstOrThrow
 */
export type BarcodeLookupCacheFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * Filter, which BarcodeLookupCache to fetch.
     */
    where?: Prisma.BarcodeLookupCacheWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BarcodeLookupCaches to fetch.
     */
    orderBy?: Prisma.BarcodeLookupCacheOrderByWithRelationInput | Prisma.BarcodeLookupCacheOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BarcodeLookupCaches.
     */
    cursor?: Prisma.BarcodeLookupCacheWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BarcodeLookupCaches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BarcodeLookupCaches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BarcodeLookupCaches.
     */
    distinct?: Prisma.BarcodeLookupCacheScalarFieldEnum | Prisma.BarcodeLookupCacheScalarFieldEnum[];
};
/**
 * BarcodeLookupCache findMany
 */
export type BarcodeLookupCacheFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * Filter, which BarcodeLookupCaches to fetch.
     */
    where?: Prisma.BarcodeLookupCacheWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BarcodeLookupCaches to fetch.
     */
    orderBy?: Prisma.BarcodeLookupCacheOrderByWithRelationInput | Prisma.BarcodeLookupCacheOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BarcodeLookupCaches.
     */
    cursor?: Prisma.BarcodeLookupCacheWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BarcodeLookupCaches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BarcodeLookupCaches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BarcodeLookupCaches.
     */
    distinct?: Prisma.BarcodeLookupCacheScalarFieldEnum | Prisma.BarcodeLookupCacheScalarFieldEnum[];
};
/**
 * BarcodeLookupCache create
 */
export type BarcodeLookupCacheCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * The data needed to create a BarcodeLookupCache.
     */
    data: Prisma.XOR<Prisma.BarcodeLookupCacheCreateInput, Prisma.BarcodeLookupCacheUncheckedCreateInput>;
};
/**
 * BarcodeLookupCache createMany
 */
export type BarcodeLookupCacheCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many BarcodeLookupCaches.
     */
    data: Prisma.BarcodeLookupCacheCreateManyInput | Prisma.BarcodeLookupCacheCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * BarcodeLookupCache createManyAndReturn
 */
export type BarcodeLookupCacheCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * The data used to create many BarcodeLookupCaches.
     */
    data: Prisma.BarcodeLookupCacheCreateManyInput | Prisma.BarcodeLookupCacheCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * BarcodeLookupCache update
 */
export type BarcodeLookupCacheUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * The data needed to update a BarcodeLookupCache.
     */
    data: Prisma.XOR<Prisma.BarcodeLookupCacheUpdateInput, Prisma.BarcodeLookupCacheUncheckedUpdateInput>;
    /**
     * Choose, which BarcodeLookupCache to update.
     */
    where: Prisma.BarcodeLookupCacheWhereUniqueInput;
};
/**
 * BarcodeLookupCache updateMany
 */
export type BarcodeLookupCacheUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update BarcodeLookupCaches.
     */
    data: Prisma.XOR<Prisma.BarcodeLookupCacheUpdateManyMutationInput, Prisma.BarcodeLookupCacheUncheckedUpdateManyInput>;
    /**
     * Filter which BarcodeLookupCaches to update
     */
    where?: Prisma.BarcodeLookupCacheWhereInput;
    /**
     * Limit how many BarcodeLookupCaches to update.
     */
    limit?: number;
};
/**
 * BarcodeLookupCache updateManyAndReturn
 */
export type BarcodeLookupCacheUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * The data used to update BarcodeLookupCaches.
     */
    data: Prisma.XOR<Prisma.BarcodeLookupCacheUpdateManyMutationInput, Prisma.BarcodeLookupCacheUncheckedUpdateManyInput>;
    /**
     * Filter which BarcodeLookupCaches to update
     */
    where?: Prisma.BarcodeLookupCacheWhereInput;
    /**
     * Limit how many BarcodeLookupCaches to update.
     */
    limit?: number;
};
/**
 * BarcodeLookupCache upsert
 */
export type BarcodeLookupCacheUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * The filter to search for the BarcodeLookupCache to update in case it exists.
     */
    where: Prisma.BarcodeLookupCacheWhereUniqueInput;
    /**
     * In case the BarcodeLookupCache found by the `where` argument doesn't exist, create a new BarcodeLookupCache with this data.
     */
    create: Prisma.XOR<Prisma.BarcodeLookupCacheCreateInput, Prisma.BarcodeLookupCacheUncheckedCreateInput>;
    /**
     * In case the BarcodeLookupCache was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.BarcodeLookupCacheUpdateInput, Prisma.BarcodeLookupCacheUncheckedUpdateInput>;
};
/**
 * BarcodeLookupCache delete
 */
export type BarcodeLookupCacheDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
    /**
     * Filter which BarcodeLookupCache to delete.
     */
    where: Prisma.BarcodeLookupCacheWhereUniqueInput;
};
/**
 * BarcodeLookupCache deleteMany
 */
export type BarcodeLookupCacheDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which BarcodeLookupCaches to delete
     */
    where?: Prisma.BarcodeLookupCacheWhereInput;
    /**
     * Limit how many BarcodeLookupCaches to delete.
     */
    limit?: number;
};
/**
 * BarcodeLookupCache without action
 */
export type BarcodeLookupCacheDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeLookupCache
     */
    select?: Prisma.BarcodeLookupCacheSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BarcodeLookupCache
     */
    omit?: Prisma.BarcodeLookupCacheOmit<ExtArgs> | null;
};
//# sourceMappingURL=BarcodeLookupCache.d.ts.map