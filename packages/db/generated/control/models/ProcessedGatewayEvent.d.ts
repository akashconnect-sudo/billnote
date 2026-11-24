import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ProcessedGatewayEvent
 *
 */
export type ProcessedGatewayEventModel = runtime.Types.Result.DefaultSelection<Prisma.$ProcessedGatewayEventPayload>;
export type AggregateProcessedGatewayEvent = {
    _count: ProcessedGatewayEventCountAggregateOutputType | null;
    _min: ProcessedGatewayEventMinAggregateOutputType | null;
    _max: ProcessedGatewayEventMaxAggregateOutputType | null;
};
export type ProcessedGatewayEventMinAggregateOutputType = {
    id: string | null;
    provider: string | null;
    eventId: string | null;
    receivedAt: Date | null;
};
export type ProcessedGatewayEventMaxAggregateOutputType = {
    id: string | null;
    provider: string | null;
    eventId: string | null;
    receivedAt: Date | null;
};
export type ProcessedGatewayEventCountAggregateOutputType = {
    id: number;
    provider: number;
    eventId: number;
    payload: number;
    receivedAt: number;
    _all: number;
};
export type ProcessedGatewayEventMinAggregateInputType = {
    id?: true;
    provider?: true;
    eventId?: true;
    receivedAt?: true;
};
export type ProcessedGatewayEventMaxAggregateInputType = {
    id?: true;
    provider?: true;
    eventId?: true;
    receivedAt?: true;
};
export type ProcessedGatewayEventCountAggregateInputType = {
    id?: true;
    provider?: true;
    eventId?: true;
    payload?: true;
    receivedAt?: true;
    _all?: true;
};
export type ProcessedGatewayEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessedGatewayEvent to aggregate.
     */
    where?: Prisma.ProcessedGatewayEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessedGatewayEvents to fetch.
     */
    orderBy?: Prisma.ProcessedGatewayEventOrderByWithRelationInput | Prisma.ProcessedGatewayEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ProcessedGatewayEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessedGatewayEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessedGatewayEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProcessedGatewayEvents
    **/
    _count?: true | ProcessedGatewayEventCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ProcessedGatewayEventMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ProcessedGatewayEventMaxAggregateInputType;
};
export type GetProcessedGatewayEventAggregateType<T extends ProcessedGatewayEventAggregateArgs> = {
    [P in keyof T & keyof AggregateProcessedGatewayEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProcessedGatewayEvent[P]> : Prisma.GetScalarType<T[P], AggregateProcessedGatewayEvent[P]>;
};
export type ProcessedGatewayEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProcessedGatewayEventWhereInput;
    orderBy?: Prisma.ProcessedGatewayEventOrderByWithAggregationInput | Prisma.ProcessedGatewayEventOrderByWithAggregationInput[];
    by: Prisma.ProcessedGatewayEventScalarFieldEnum[] | Prisma.ProcessedGatewayEventScalarFieldEnum;
    having?: Prisma.ProcessedGatewayEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProcessedGatewayEventCountAggregateInputType | true;
    _min?: ProcessedGatewayEventMinAggregateInputType;
    _max?: ProcessedGatewayEventMaxAggregateInputType;
};
export type ProcessedGatewayEventGroupByOutputType = {
    id: string;
    provider: string;
    eventId: string;
    payload: runtime.JsonValue;
    receivedAt: Date;
    _count: ProcessedGatewayEventCountAggregateOutputType | null;
    _min: ProcessedGatewayEventMinAggregateOutputType | null;
    _max: ProcessedGatewayEventMaxAggregateOutputType | null;
};
export type GetProcessedGatewayEventGroupByPayload<T extends ProcessedGatewayEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProcessedGatewayEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProcessedGatewayEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProcessedGatewayEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProcessedGatewayEventGroupByOutputType[P]>;
}>>;
export type ProcessedGatewayEventWhereInput = {
    AND?: Prisma.ProcessedGatewayEventWhereInput | Prisma.ProcessedGatewayEventWhereInput[];
    OR?: Prisma.ProcessedGatewayEventWhereInput[];
    NOT?: Prisma.ProcessedGatewayEventWhereInput | Prisma.ProcessedGatewayEventWhereInput[];
    id?: Prisma.UuidFilter<"ProcessedGatewayEvent"> | string;
    provider?: Prisma.StringFilter<"ProcessedGatewayEvent"> | string;
    eventId?: Prisma.StringFilter<"ProcessedGatewayEvent"> | string;
    payload?: Prisma.JsonFilter<"ProcessedGatewayEvent">;
    receivedAt?: Prisma.DateTimeFilter<"ProcessedGatewayEvent"> | Date | string;
};
export type ProcessedGatewayEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type ProcessedGatewayEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    provider_eventId?: Prisma.ProcessedGatewayEventProviderEventIdCompoundUniqueInput;
    AND?: Prisma.ProcessedGatewayEventWhereInput | Prisma.ProcessedGatewayEventWhereInput[];
    OR?: Prisma.ProcessedGatewayEventWhereInput[];
    NOT?: Prisma.ProcessedGatewayEventWhereInput | Prisma.ProcessedGatewayEventWhereInput[];
    provider?: Prisma.StringFilter<"ProcessedGatewayEvent"> | string;
    eventId?: Prisma.StringFilter<"ProcessedGatewayEvent"> | string;
    payload?: Prisma.JsonFilter<"ProcessedGatewayEvent">;
    receivedAt?: Prisma.DateTimeFilter<"ProcessedGatewayEvent"> | Date | string;
}, "id" | "provider_eventId">;
export type ProcessedGatewayEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    _count?: Prisma.ProcessedGatewayEventCountOrderByAggregateInput;
    _max?: Prisma.ProcessedGatewayEventMaxOrderByAggregateInput;
    _min?: Prisma.ProcessedGatewayEventMinOrderByAggregateInput;
};
export type ProcessedGatewayEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProcessedGatewayEventScalarWhereWithAggregatesInput | Prisma.ProcessedGatewayEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProcessedGatewayEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProcessedGatewayEventScalarWhereWithAggregatesInput | Prisma.ProcessedGatewayEventScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"ProcessedGatewayEvent"> | string;
    provider?: Prisma.StringWithAggregatesFilter<"ProcessedGatewayEvent"> | string;
    eventId?: Prisma.StringWithAggregatesFilter<"ProcessedGatewayEvent"> | string;
    payload?: Prisma.JsonWithAggregatesFilter<"ProcessedGatewayEvent">;
    receivedAt?: Prisma.DateTimeWithAggregatesFilter<"ProcessedGatewayEvent"> | Date | string;
};
export type ProcessedGatewayEventCreateInput = {
    id?: string;
    provider: string;
    eventId: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Date | string;
};
export type ProcessedGatewayEventUncheckedCreateInput = {
    id?: string;
    provider: string;
    eventId: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Date | string;
};
export type ProcessedGatewayEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProcessedGatewayEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProcessedGatewayEventCreateManyInput = {
    id?: string;
    provider: string;
    eventId: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Date | string;
};
export type ProcessedGatewayEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProcessedGatewayEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProcessedGatewayEventProviderEventIdCompoundUniqueInput = {
    provider: string;
    eventId: string;
};
export type ProcessedGatewayEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type ProcessedGatewayEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type ProcessedGatewayEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type ProcessedGatewayEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    provider?: boolean;
    eventId?: boolean;
    payload?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["processedGatewayEvent"]>;
export type ProcessedGatewayEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    provider?: boolean;
    eventId?: boolean;
    payload?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["processedGatewayEvent"]>;
export type ProcessedGatewayEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    provider?: boolean;
    eventId?: boolean;
    payload?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["processedGatewayEvent"]>;
export type ProcessedGatewayEventSelectScalar = {
    id?: boolean;
    provider?: boolean;
    eventId?: boolean;
    payload?: boolean;
    receivedAt?: boolean;
};
export type ProcessedGatewayEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "provider" | "eventId" | "payload" | "receivedAt", ExtArgs["result"]["processedGatewayEvent"]>;
export type $ProcessedGatewayEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProcessedGatewayEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        provider: string;
        eventId: string;
        payload: runtime.JsonValue;
        receivedAt: Date;
    }, ExtArgs["result"]["processedGatewayEvent"]>;
    composites: {};
};
export type ProcessedGatewayEventGetPayload<S extends boolean | null | undefined | ProcessedGatewayEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload, S>;
export type ProcessedGatewayEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProcessedGatewayEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProcessedGatewayEventCountAggregateInputType | true;
};
export interface ProcessedGatewayEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProcessedGatewayEvent'];
        meta: {
            name: 'ProcessedGatewayEvent';
        };
    };
    /**
     * Find zero or one ProcessedGatewayEvent that matches the filter.
     * @param {ProcessedGatewayEventFindUniqueArgs} args - Arguments to find a ProcessedGatewayEvent
     * @example
     * // Get one ProcessedGatewayEvent
     * const processedGatewayEvent = await prisma.processedGatewayEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcessedGatewayEventFindUniqueArgs>(args: Prisma.SelectSubset<T, ProcessedGatewayEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProcessedGatewayEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ProcessedGatewayEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProcessedGatewayEventFindUniqueOrThrowArgs} args - Arguments to find a ProcessedGatewayEvent
     * @example
     * // Get one ProcessedGatewayEvent
     * const processedGatewayEvent = await prisma.processedGatewayEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcessedGatewayEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProcessedGatewayEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProcessedGatewayEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ProcessedGatewayEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedGatewayEventFindFirstArgs} args - Arguments to find a ProcessedGatewayEvent
     * @example
     * // Get one ProcessedGatewayEvent
     * const processedGatewayEvent = await prisma.processedGatewayEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcessedGatewayEventFindFirstArgs>(args?: Prisma.SelectSubset<T, ProcessedGatewayEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProcessedGatewayEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ProcessedGatewayEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedGatewayEventFindFirstOrThrowArgs} args - Arguments to find a ProcessedGatewayEvent
     * @example
     * // Get one ProcessedGatewayEvent
     * const processedGatewayEvent = await prisma.processedGatewayEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcessedGatewayEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProcessedGatewayEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProcessedGatewayEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ProcessedGatewayEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedGatewayEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProcessedGatewayEvents
     * const processedGatewayEvents = await prisma.processedGatewayEvent.findMany()
     *
     * // Get first 10 ProcessedGatewayEvents
     * const processedGatewayEvents = await prisma.processedGatewayEvent.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const processedGatewayEventWithIdOnly = await prisma.processedGatewayEvent.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProcessedGatewayEventFindManyArgs>(args?: Prisma.SelectSubset<T, ProcessedGatewayEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ProcessedGatewayEvent.
     * @param {ProcessedGatewayEventCreateArgs} args - Arguments to create a ProcessedGatewayEvent.
     * @example
     * // Create one ProcessedGatewayEvent
     * const ProcessedGatewayEvent = await prisma.processedGatewayEvent.create({
     *   data: {
     *     // ... data to create a ProcessedGatewayEvent
     *   }
     * })
     *
     */
    create<T extends ProcessedGatewayEventCreateArgs>(args: Prisma.SelectSubset<T, ProcessedGatewayEventCreateArgs<ExtArgs>>): Prisma.Prisma__ProcessedGatewayEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ProcessedGatewayEvents.
     * @param {ProcessedGatewayEventCreateManyArgs} args - Arguments to create many ProcessedGatewayEvents.
     * @example
     * // Create many ProcessedGatewayEvents
     * const processedGatewayEvent = await prisma.processedGatewayEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProcessedGatewayEventCreateManyArgs>(args?: Prisma.SelectSubset<T, ProcessedGatewayEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ProcessedGatewayEvents and returns the data saved in the database.
     * @param {ProcessedGatewayEventCreateManyAndReturnArgs} args - Arguments to create many ProcessedGatewayEvents.
     * @example
     * // Create many ProcessedGatewayEvents
     * const processedGatewayEvent = await prisma.processedGatewayEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProcessedGatewayEvents and only return the `id`
     * const processedGatewayEventWithIdOnly = await prisma.processedGatewayEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProcessedGatewayEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProcessedGatewayEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ProcessedGatewayEvent.
     * @param {ProcessedGatewayEventDeleteArgs} args - Arguments to delete one ProcessedGatewayEvent.
     * @example
     * // Delete one ProcessedGatewayEvent
     * const ProcessedGatewayEvent = await prisma.processedGatewayEvent.delete({
     *   where: {
     *     // ... filter to delete one ProcessedGatewayEvent
     *   }
     * })
     *
     */
    delete<T extends ProcessedGatewayEventDeleteArgs>(args: Prisma.SelectSubset<T, ProcessedGatewayEventDeleteArgs<ExtArgs>>): Prisma.Prisma__ProcessedGatewayEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ProcessedGatewayEvent.
     * @param {ProcessedGatewayEventUpdateArgs} args - Arguments to update one ProcessedGatewayEvent.
     * @example
     * // Update one ProcessedGatewayEvent
     * const processedGatewayEvent = await prisma.processedGatewayEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProcessedGatewayEventUpdateArgs>(args: Prisma.SelectSubset<T, ProcessedGatewayEventUpdateArgs<ExtArgs>>): Prisma.Prisma__ProcessedGatewayEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ProcessedGatewayEvents.
     * @param {ProcessedGatewayEventDeleteManyArgs} args - Arguments to filter ProcessedGatewayEvents to delete.
     * @example
     * // Delete a few ProcessedGatewayEvents
     * const { count } = await prisma.processedGatewayEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProcessedGatewayEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProcessedGatewayEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ProcessedGatewayEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedGatewayEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProcessedGatewayEvents
     * const processedGatewayEvent = await prisma.processedGatewayEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProcessedGatewayEventUpdateManyArgs>(args: Prisma.SelectSubset<T, ProcessedGatewayEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ProcessedGatewayEvents and returns the data updated in the database.
     * @param {ProcessedGatewayEventUpdateManyAndReturnArgs} args - Arguments to update many ProcessedGatewayEvents.
     * @example
     * // Update many ProcessedGatewayEvents
     * const processedGatewayEvent = await prisma.processedGatewayEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProcessedGatewayEvents and only return the `id`
     * const processedGatewayEventWithIdOnly = await prisma.processedGatewayEvent.updateManyAndReturn({
     *   select: { id: true },
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
    updateManyAndReturn<T extends ProcessedGatewayEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProcessedGatewayEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ProcessedGatewayEvent.
     * @param {ProcessedGatewayEventUpsertArgs} args - Arguments to update or create a ProcessedGatewayEvent.
     * @example
     * // Update or create a ProcessedGatewayEvent
     * const processedGatewayEvent = await prisma.processedGatewayEvent.upsert({
     *   create: {
     *     // ... data to create a ProcessedGatewayEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProcessedGatewayEvent we want to update
     *   }
     * })
     */
    upsert<T extends ProcessedGatewayEventUpsertArgs>(args: Prisma.SelectSubset<T, ProcessedGatewayEventUpsertArgs<ExtArgs>>): Prisma.Prisma__ProcessedGatewayEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedGatewayEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ProcessedGatewayEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedGatewayEventCountArgs} args - Arguments to filter ProcessedGatewayEvents to count.
     * @example
     * // Count the number of ProcessedGatewayEvents
     * const count = await prisma.processedGatewayEvent.count({
     *   where: {
     *     // ... the filter for the ProcessedGatewayEvents we want to count
     *   }
     * })
    **/
    count<T extends ProcessedGatewayEventCountArgs>(args?: Prisma.Subset<T, ProcessedGatewayEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProcessedGatewayEventCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ProcessedGatewayEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedGatewayEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProcessedGatewayEventAggregateArgs>(args: Prisma.Subset<T, ProcessedGatewayEventAggregateArgs>): Prisma.PrismaPromise<GetProcessedGatewayEventAggregateType<T>>;
    /**
     * Group by ProcessedGatewayEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedGatewayEventGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ProcessedGatewayEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProcessedGatewayEventGroupByArgs['orderBy'];
    } : {
        orderBy?: ProcessedGatewayEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProcessedGatewayEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcessedGatewayEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ProcessedGatewayEvent model
     */
    readonly fields: ProcessedGatewayEventFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ProcessedGatewayEvent.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ProcessedGatewayEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the ProcessedGatewayEvent model
 */
export interface ProcessedGatewayEventFieldRefs {
    readonly id: Prisma.FieldRef<"ProcessedGatewayEvent", 'String'>;
    readonly provider: Prisma.FieldRef<"ProcessedGatewayEvent", 'String'>;
    readonly eventId: Prisma.FieldRef<"ProcessedGatewayEvent", 'String'>;
    readonly payload: Prisma.FieldRef<"ProcessedGatewayEvent", 'Json'>;
    readonly receivedAt: Prisma.FieldRef<"ProcessedGatewayEvent", 'DateTime'>;
}
/**
 * ProcessedGatewayEvent findUnique
 */
export type ProcessedGatewayEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * Filter, which ProcessedGatewayEvent to fetch.
     */
    where: Prisma.ProcessedGatewayEventWhereUniqueInput;
};
/**
 * ProcessedGatewayEvent findUniqueOrThrow
 */
export type ProcessedGatewayEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * Filter, which ProcessedGatewayEvent to fetch.
     */
    where: Prisma.ProcessedGatewayEventWhereUniqueInput;
};
/**
 * ProcessedGatewayEvent findFirst
 */
export type ProcessedGatewayEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * Filter, which ProcessedGatewayEvent to fetch.
     */
    where?: Prisma.ProcessedGatewayEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessedGatewayEvents to fetch.
     */
    orderBy?: Prisma.ProcessedGatewayEventOrderByWithRelationInput | Prisma.ProcessedGatewayEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProcessedGatewayEvents.
     */
    cursor?: Prisma.ProcessedGatewayEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessedGatewayEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessedGatewayEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProcessedGatewayEvents.
     */
    distinct?: Prisma.ProcessedGatewayEventScalarFieldEnum | Prisma.ProcessedGatewayEventScalarFieldEnum[];
};
/**
 * ProcessedGatewayEvent findFirstOrThrow
 */
export type ProcessedGatewayEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * Filter, which ProcessedGatewayEvent to fetch.
     */
    where?: Prisma.ProcessedGatewayEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessedGatewayEvents to fetch.
     */
    orderBy?: Prisma.ProcessedGatewayEventOrderByWithRelationInput | Prisma.ProcessedGatewayEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProcessedGatewayEvents.
     */
    cursor?: Prisma.ProcessedGatewayEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessedGatewayEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessedGatewayEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProcessedGatewayEvents.
     */
    distinct?: Prisma.ProcessedGatewayEventScalarFieldEnum | Prisma.ProcessedGatewayEventScalarFieldEnum[];
};
/**
 * ProcessedGatewayEvent findMany
 */
export type ProcessedGatewayEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * Filter, which ProcessedGatewayEvents to fetch.
     */
    where?: Prisma.ProcessedGatewayEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessedGatewayEvents to fetch.
     */
    orderBy?: Prisma.ProcessedGatewayEventOrderByWithRelationInput | Prisma.ProcessedGatewayEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProcessedGatewayEvents.
     */
    cursor?: Prisma.ProcessedGatewayEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessedGatewayEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessedGatewayEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProcessedGatewayEvents.
     */
    distinct?: Prisma.ProcessedGatewayEventScalarFieldEnum | Prisma.ProcessedGatewayEventScalarFieldEnum[];
};
/**
 * ProcessedGatewayEvent create
 */
export type ProcessedGatewayEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * The data needed to create a ProcessedGatewayEvent.
     */
    data: Prisma.XOR<Prisma.ProcessedGatewayEventCreateInput, Prisma.ProcessedGatewayEventUncheckedCreateInput>;
};
/**
 * ProcessedGatewayEvent createMany
 */
export type ProcessedGatewayEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProcessedGatewayEvents.
     */
    data: Prisma.ProcessedGatewayEventCreateManyInput | Prisma.ProcessedGatewayEventCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ProcessedGatewayEvent createManyAndReturn
 */
export type ProcessedGatewayEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * The data used to create many ProcessedGatewayEvents.
     */
    data: Prisma.ProcessedGatewayEventCreateManyInput | Prisma.ProcessedGatewayEventCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ProcessedGatewayEvent update
 */
export type ProcessedGatewayEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * The data needed to update a ProcessedGatewayEvent.
     */
    data: Prisma.XOR<Prisma.ProcessedGatewayEventUpdateInput, Prisma.ProcessedGatewayEventUncheckedUpdateInput>;
    /**
     * Choose, which ProcessedGatewayEvent to update.
     */
    where: Prisma.ProcessedGatewayEventWhereUniqueInput;
};
/**
 * ProcessedGatewayEvent updateMany
 */
export type ProcessedGatewayEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ProcessedGatewayEvents.
     */
    data: Prisma.XOR<Prisma.ProcessedGatewayEventUpdateManyMutationInput, Prisma.ProcessedGatewayEventUncheckedUpdateManyInput>;
    /**
     * Filter which ProcessedGatewayEvents to update
     */
    where?: Prisma.ProcessedGatewayEventWhereInput;
    /**
     * Limit how many ProcessedGatewayEvents to update.
     */
    limit?: number;
};
/**
 * ProcessedGatewayEvent updateManyAndReturn
 */
export type ProcessedGatewayEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * The data used to update ProcessedGatewayEvents.
     */
    data: Prisma.XOR<Prisma.ProcessedGatewayEventUpdateManyMutationInput, Prisma.ProcessedGatewayEventUncheckedUpdateManyInput>;
    /**
     * Filter which ProcessedGatewayEvents to update
     */
    where?: Prisma.ProcessedGatewayEventWhereInput;
    /**
     * Limit how many ProcessedGatewayEvents to update.
     */
    limit?: number;
};
/**
 * ProcessedGatewayEvent upsert
 */
export type ProcessedGatewayEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * The filter to search for the ProcessedGatewayEvent to update in case it exists.
     */
    where: Prisma.ProcessedGatewayEventWhereUniqueInput;
    /**
     * In case the ProcessedGatewayEvent found by the `where` argument doesn't exist, create a new ProcessedGatewayEvent with this data.
     */
    create: Prisma.XOR<Prisma.ProcessedGatewayEventCreateInput, Prisma.ProcessedGatewayEventUncheckedCreateInput>;
    /**
     * In case the ProcessedGatewayEvent was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ProcessedGatewayEventUpdateInput, Prisma.ProcessedGatewayEventUncheckedUpdateInput>;
};
/**
 * ProcessedGatewayEvent delete
 */
export type ProcessedGatewayEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
    /**
     * Filter which ProcessedGatewayEvent to delete.
     */
    where: Prisma.ProcessedGatewayEventWhereUniqueInput;
};
/**
 * ProcessedGatewayEvent deleteMany
 */
export type ProcessedGatewayEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessedGatewayEvents to delete
     */
    where?: Prisma.ProcessedGatewayEventWhereInput;
    /**
     * Limit how many ProcessedGatewayEvents to delete.
     */
    limit?: number;
};
/**
 * ProcessedGatewayEvent without action
 */
export type ProcessedGatewayEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedGatewayEvent
     */
    select?: Prisma.ProcessedGatewayEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedGatewayEvent
     */
    omit?: Prisma.ProcessedGatewayEventOmit<ExtArgs> | null;
};
//# sourceMappingURL=ProcessedGatewayEvent.d.ts.map