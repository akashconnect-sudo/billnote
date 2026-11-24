import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model StaffInvite
 *
 */
export type StaffInviteModel = runtime.Types.Result.DefaultSelection<Prisma.$StaffInvitePayload>;
export type AggregateStaffInvite = {
    _count: StaffInviteCountAggregateOutputType | null;
    _min: StaffInviteMinAggregateOutputType | null;
    _max: StaffInviteMaxAggregateOutputType | null;
};
export type StaffInviteMinAggregateOutputType = {
    id: string | null;
    businessId: string | null;
    destination: string | null;
    roleKey: string | null;
    tokenHash: string | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    createdAt: Date | null;
};
export type StaffInviteMaxAggregateOutputType = {
    id: string | null;
    businessId: string | null;
    destination: string | null;
    roleKey: string | null;
    tokenHash: string | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    createdAt: Date | null;
};
export type StaffInviteCountAggregateOutputType = {
    id: number;
    businessId: number;
    destination: number;
    roleKey: number;
    tokenHash: number;
    expiresAt: number;
    acceptedAt: number;
    createdAt: number;
    _all: number;
};
export type StaffInviteMinAggregateInputType = {
    id?: true;
    businessId?: true;
    destination?: true;
    roleKey?: true;
    tokenHash?: true;
    expiresAt?: true;
    acceptedAt?: true;
    createdAt?: true;
};
export type StaffInviteMaxAggregateInputType = {
    id?: true;
    businessId?: true;
    destination?: true;
    roleKey?: true;
    tokenHash?: true;
    expiresAt?: true;
    acceptedAt?: true;
    createdAt?: true;
};
export type StaffInviteCountAggregateInputType = {
    id?: true;
    businessId?: true;
    destination?: true;
    roleKey?: true;
    tokenHash?: true;
    expiresAt?: true;
    acceptedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type StaffInviteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which StaffInvite to aggregate.
     */
    where?: Prisma.StaffInviteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StaffInvites to fetch.
     */
    orderBy?: Prisma.StaffInviteOrderByWithRelationInput | Prisma.StaffInviteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.StaffInviteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StaffInvites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StaffInvites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned StaffInvites
    **/
    _count?: true | StaffInviteCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: StaffInviteMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: StaffInviteMaxAggregateInputType;
};
export type GetStaffInviteAggregateType<T extends StaffInviteAggregateArgs> = {
    [P in keyof T & keyof AggregateStaffInvite]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStaffInvite[P]> : Prisma.GetScalarType<T[P], AggregateStaffInvite[P]>;
};
export type StaffInviteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StaffInviteWhereInput;
    orderBy?: Prisma.StaffInviteOrderByWithAggregationInput | Prisma.StaffInviteOrderByWithAggregationInput[];
    by: Prisma.StaffInviteScalarFieldEnum[] | Prisma.StaffInviteScalarFieldEnum;
    having?: Prisma.StaffInviteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StaffInviteCountAggregateInputType | true;
    _min?: StaffInviteMinAggregateInputType;
    _max?: StaffInviteMaxAggregateInputType;
};
export type StaffInviteGroupByOutputType = {
    id: string;
    businessId: string;
    destination: string;
    roleKey: string;
    tokenHash: string;
    expiresAt: Date;
    acceptedAt: Date | null;
    createdAt: Date;
    _count: StaffInviteCountAggregateOutputType | null;
    _min: StaffInviteMinAggregateOutputType | null;
    _max: StaffInviteMaxAggregateOutputType | null;
};
export type GetStaffInviteGroupByPayload<T extends StaffInviteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StaffInviteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StaffInviteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StaffInviteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StaffInviteGroupByOutputType[P]>;
}>>;
export type StaffInviteWhereInput = {
    AND?: Prisma.StaffInviteWhereInput | Prisma.StaffInviteWhereInput[];
    OR?: Prisma.StaffInviteWhereInput[];
    NOT?: Prisma.StaffInviteWhereInput | Prisma.StaffInviteWhereInput[];
    id?: Prisma.UuidFilter<"StaffInvite"> | string;
    businessId?: Prisma.UuidFilter<"StaffInvite"> | string;
    destination?: Prisma.StringFilter<"StaffInvite"> | string;
    roleKey?: Prisma.StringFilter<"StaffInvite"> | string;
    tokenHash?: Prisma.StringFilter<"StaffInvite"> | string;
    expiresAt?: Prisma.DateTimeFilter<"StaffInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"StaffInvite"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StaffInvite"> | Date | string;
    business?: Prisma.XOR<Prisma.BusinessScalarRelationFilter, Prisma.BusinessWhereInput>;
};
export type StaffInviteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    destination?: Prisma.SortOrder;
    roleKey?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    business?: Prisma.BusinessOrderByWithRelationInput;
};
export type StaffInviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StaffInviteWhereInput | Prisma.StaffInviteWhereInput[];
    OR?: Prisma.StaffInviteWhereInput[];
    NOT?: Prisma.StaffInviteWhereInput | Prisma.StaffInviteWhereInput[];
    businessId?: Prisma.UuidFilter<"StaffInvite"> | string;
    destination?: Prisma.StringFilter<"StaffInvite"> | string;
    roleKey?: Prisma.StringFilter<"StaffInvite"> | string;
    tokenHash?: Prisma.StringFilter<"StaffInvite"> | string;
    expiresAt?: Prisma.DateTimeFilter<"StaffInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"StaffInvite"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StaffInvite"> | Date | string;
    business?: Prisma.XOR<Prisma.BusinessScalarRelationFilter, Prisma.BusinessWhereInput>;
}, "id">;
export type StaffInviteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    destination?: Prisma.SortOrder;
    roleKey?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.StaffInviteCountOrderByAggregateInput;
    _max?: Prisma.StaffInviteMaxOrderByAggregateInput;
    _min?: Prisma.StaffInviteMinOrderByAggregateInput;
};
export type StaffInviteScalarWhereWithAggregatesInput = {
    AND?: Prisma.StaffInviteScalarWhereWithAggregatesInput | Prisma.StaffInviteScalarWhereWithAggregatesInput[];
    OR?: Prisma.StaffInviteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StaffInviteScalarWhereWithAggregatesInput | Prisma.StaffInviteScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"StaffInvite"> | string;
    businessId?: Prisma.UuidWithAggregatesFilter<"StaffInvite"> | string;
    destination?: Prisma.StringWithAggregatesFilter<"StaffInvite"> | string;
    roleKey?: Prisma.StringWithAggregatesFilter<"StaffInvite"> | string;
    tokenHash?: Prisma.StringWithAggregatesFilter<"StaffInvite"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"StaffInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"StaffInvite"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"StaffInvite"> | Date | string;
};
export type StaffInviteCreateInput = {
    id?: string;
    destination: string;
    roleKey: string;
    tokenHash: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
    business: Prisma.BusinessCreateNestedOneWithoutStaffInvitesInput;
};
export type StaffInviteUncheckedCreateInput = {
    id?: string;
    businessId: string;
    destination: string;
    roleKey: string;
    tokenHash: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffInviteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    destination?: Prisma.StringFieldUpdateOperationsInput | string;
    roleKey?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    business?: Prisma.BusinessUpdateOneRequiredWithoutStaffInvitesNestedInput;
};
export type StaffInviteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    businessId?: Prisma.StringFieldUpdateOperationsInput | string;
    destination?: Prisma.StringFieldUpdateOperationsInput | string;
    roleKey?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffInviteCreateManyInput = {
    id?: string;
    businessId: string;
    destination: string;
    roleKey: string;
    tokenHash: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffInviteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    destination?: Prisma.StringFieldUpdateOperationsInput | string;
    roleKey?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffInviteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    businessId?: Prisma.StringFieldUpdateOperationsInput | string;
    destination?: Prisma.StringFieldUpdateOperationsInput | string;
    roleKey?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffInviteListRelationFilter = {
    every?: Prisma.StaffInviteWhereInput;
    some?: Prisma.StaffInviteWhereInput;
    none?: Prisma.StaffInviteWhereInput;
};
export type StaffInviteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StaffInviteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    destination?: Prisma.SortOrder;
    roleKey?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StaffInviteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    destination?: Prisma.SortOrder;
    roleKey?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StaffInviteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    destination?: Prisma.SortOrder;
    roleKey?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StaffInviteCreateNestedManyWithoutBusinessInput = {
    create?: Prisma.XOR<Prisma.StaffInviteCreateWithoutBusinessInput, Prisma.StaffInviteUncheckedCreateWithoutBusinessInput> | Prisma.StaffInviteCreateWithoutBusinessInput[] | Prisma.StaffInviteUncheckedCreateWithoutBusinessInput[];
    connectOrCreate?: Prisma.StaffInviteCreateOrConnectWithoutBusinessInput | Prisma.StaffInviteCreateOrConnectWithoutBusinessInput[];
    createMany?: Prisma.StaffInviteCreateManyBusinessInputEnvelope;
    connect?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
};
export type StaffInviteUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: Prisma.XOR<Prisma.StaffInviteCreateWithoutBusinessInput, Prisma.StaffInviteUncheckedCreateWithoutBusinessInput> | Prisma.StaffInviteCreateWithoutBusinessInput[] | Prisma.StaffInviteUncheckedCreateWithoutBusinessInput[];
    connectOrCreate?: Prisma.StaffInviteCreateOrConnectWithoutBusinessInput | Prisma.StaffInviteCreateOrConnectWithoutBusinessInput[];
    createMany?: Prisma.StaffInviteCreateManyBusinessInputEnvelope;
    connect?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
};
export type StaffInviteUpdateManyWithoutBusinessNestedInput = {
    create?: Prisma.XOR<Prisma.StaffInviteCreateWithoutBusinessInput, Prisma.StaffInviteUncheckedCreateWithoutBusinessInput> | Prisma.StaffInviteCreateWithoutBusinessInput[] | Prisma.StaffInviteUncheckedCreateWithoutBusinessInput[];
    connectOrCreate?: Prisma.StaffInviteCreateOrConnectWithoutBusinessInput | Prisma.StaffInviteCreateOrConnectWithoutBusinessInput[];
    upsert?: Prisma.StaffInviteUpsertWithWhereUniqueWithoutBusinessInput | Prisma.StaffInviteUpsertWithWhereUniqueWithoutBusinessInput[];
    createMany?: Prisma.StaffInviteCreateManyBusinessInputEnvelope;
    set?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
    disconnect?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
    delete?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
    connect?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
    update?: Prisma.StaffInviteUpdateWithWhereUniqueWithoutBusinessInput | Prisma.StaffInviteUpdateWithWhereUniqueWithoutBusinessInput[];
    updateMany?: Prisma.StaffInviteUpdateManyWithWhereWithoutBusinessInput | Prisma.StaffInviteUpdateManyWithWhereWithoutBusinessInput[];
    deleteMany?: Prisma.StaffInviteScalarWhereInput | Prisma.StaffInviteScalarWhereInput[];
};
export type StaffInviteUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: Prisma.XOR<Prisma.StaffInviteCreateWithoutBusinessInput, Prisma.StaffInviteUncheckedCreateWithoutBusinessInput> | Prisma.StaffInviteCreateWithoutBusinessInput[] | Prisma.StaffInviteUncheckedCreateWithoutBusinessInput[];
    connectOrCreate?: Prisma.StaffInviteCreateOrConnectWithoutBusinessInput | Prisma.StaffInviteCreateOrConnectWithoutBusinessInput[];
    upsert?: Prisma.StaffInviteUpsertWithWhereUniqueWithoutBusinessInput | Prisma.StaffInviteUpsertWithWhereUniqueWithoutBusinessInput[];
    createMany?: Prisma.StaffInviteCreateManyBusinessInputEnvelope;
    set?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
    disconnect?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
    delete?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
    connect?: Prisma.StaffInviteWhereUniqueInput | Prisma.StaffInviteWhereUniqueInput[];
    update?: Prisma.StaffInviteUpdateWithWhereUniqueWithoutBusinessInput | Prisma.StaffInviteUpdateWithWhereUniqueWithoutBusinessInput[];
    updateMany?: Prisma.StaffInviteUpdateManyWithWhereWithoutBusinessInput | Prisma.StaffInviteUpdateManyWithWhereWithoutBusinessInput[];
    deleteMany?: Prisma.StaffInviteScalarWhereInput | Prisma.StaffInviteScalarWhereInput[];
};
export type StaffInviteCreateWithoutBusinessInput = {
    id?: string;
    destination: string;
    roleKey: string;
    tokenHash: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffInviteUncheckedCreateWithoutBusinessInput = {
    id?: string;
    destination: string;
    roleKey: string;
    tokenHash: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffInviteCreateOrConnectWithoutBusinessInput = {
    where: Prisma.StaffInviteWhereUniqueInput;
    create: Prisma.XOR<Prisma.StaffInviteCreateWithoutBusinessInput, Prisma.StaffInviteUncheckedCreateWithoutBusinessInput>;
};
export type StaffInviteCreateManyBusinessInputEnvelope = {
    data: Prisma.StaffInviteCreateManyBusinessInput | Prisma.StaffInviteCreateManyBusinessInput[];
    skipDuplicates?: boolean;
};
export type StaffInviteUpsertWithWhereUniqueWithoutBusinessInput = {
    where: Prisma.StaffInviteWhereUniqueInput;
    update: Prisma.XOR<Prisma.StaffInviteUpdateWithoutBusinessInput, Prisma.StaffInviteUncheckedUpdateWithoutBusinessInput>;
    create: Prisma.XOR<Prisma.StaffInviteCreateWithoutBusinessInput, Prisma.StaffInviteUncheckedCreateWithoutBusinessInput>;
};
export type StaffInviteUpdateWithWhereUniqueWithoutBusinessInput = {
    where: Prisma.StaffInviteWhereUniqueInput;
    data: Prisma.XOR<Prisma.StaffInviteUpdateWithoutBusinessInput, Prisma.StaffInviteUncheckedUpdateWithoutBusinessInput>;
};
export type StaffInviteUpdateManyWithWhereWithoutBusinessInput = {
    where: Prisma.StaffInviteScalarWhereInput;
    data: Prisma.XOR<Prisma.StaffInviteUpdateManyMutationInput, Prisma.StaffInviteUncheckedUpdateManyWithoutBusinessInput>;
};
export type StaffInviteScalarWhereInput = {
    AND?: Prisma.StaffInviteScalarWhereInput | Prisma.StaffInviteScalarWhereInput[];
    OR?: Prisma.StaffInviteScalarWhereInput[];
    NOT?: Prisma.StaffInviteScalarWhereInput | Prisma.StaffInviteScalarWhereInput[];
    id?: Prisma.UuidFilter<"StaffInvite"> | string;
    businessId?: Prisma.UuidFilter<"StaffInvite"> | string;
    destination?: Prisma.StringFilter<"StaffInvite"> | string;
    roleKey?: Prisma.StringFilter<"StaffInvite"> | string;
    tokenHash?: Prisma.StringFilter<"StaffInvite"> | string;
    expiresAt?: Prisma.DateTimeFilter<"StaffInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"StaffInvite"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StaffInvite"> | Date | string;
};
export type StaffInviteCreateManyBusinessInput = {
    id?: string;
    destination: string;
    roleKey: string;
    tokenHash: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffInviteUpdateWithoutBusinessInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    destination?: Prisma.StringFieldUpdateOperationsInput | string;
    roleKey?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffInviteUncheckedUpdateWithoutBusinessInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    destination?: Prisma.StringFieldUpdateOperationsInput | string;
    roleKey?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffInviteUncheckedUpdateManyWithoutBusinessInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    destination?: Prisma.StringFieldUpdateOperationsInput | string;
    roleKey?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffInviteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    businessId?: boolean;
    destination?: boolean;
    roleKey?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdAt?: boolean;
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["staffInvite"]>;
export type StaffInviteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    businessId?: boolean;
    destination?: boolean;
    roleKey?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdAt?: boolean;
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["staffInvite"]>;
export type StaffInviteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    businessId?: boolean;
    destination?: boolean;
    roleKey?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdAt?: boolean;
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["staffInvite"]>;
export type StaffInviteSelectScalar = {
    id?: boolean;
    businessId?: boolean;
    destination?: boolean;
    roleKey?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdAt?: boolean;
};
export type StaffInviteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "businessId" | "destination" | "roleKey" | "tokenHash" | "expiresAt" | "acceptedAt" | "createdAt", ExtArgs["result"]["staffInvite"]>;
export type StaffInviteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
};
export type StaffInviteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
};
export type StaffInviteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
};
export type $StaffInvitePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StaffInvite";
    objects: {
        business: Prisma.$BusinessPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        businessId: string;
        destination: string;
        roleKey: string;
        tokenHash: string;
        expiresAt: Date;
        acceptedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["staffInvite"]>;
    composites: {};
};
export type StaffInviteGetPayload<S extends boolean | null | undefined | StaffInviteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload, S>;
export type StaffInviteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StaffInviteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StaffInviteCountAggregateInputType | true;
};
export interface StaffInviteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StaffInvite'];
        meta: {
            name: 'StaffInvite';
        };
    };
    /**
     * Find zero or one StaffInvite that matches the filter.
     * @param {StaffInviteFindUniqueArgs} args - Arguments to find a StaffInvite
     * @example
     * // Get one StaffInvite
     * const staffInvite = await prisma.staffInvite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StaffInviteFindUniqueArgs>(args: Prisma.SelectSubset<T, StaffInviteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StaffInviteClient<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one StaffInvite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StaffInviteFindUniqueOrThrowArgs} args - Arguments to find a StaffInvite
     * @example
     * // Get one StaffInvite
     * const staffInvite = await prisma.staffInvite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StaffInviteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StaffInviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StaffInviteClient<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first StaffInvite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffInviteFindFirstArgs} args - Arguments to find a StaffInvite
     * @example
     * // Get one StaffInvite
     * const staffInvite = await prisma.staffInvite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StaffInviteFindFirstArgs>(args?: Prisma.SelectSubset<T, StaffInviteFindFirstArgs<ExtArgs>>): Prisma.Prisma__StaffInviteClient<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first StaffInvite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffInviteFindFirstOrThrowArgs} args - Arguments to find a StaffInvite
     * @example
     * // Get one StaffInvite
     * const staffInvite = await prisma.staffInvite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StaffInviteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StaffInviteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StaffInviteClient<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more StaffInvites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffInviteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StaffInvites
     * const staffInvites = await prisma.staffInvite.findMany()
     *
     * // Get first 10 StaffInvites
     * const staffInvites = await prisma.staffInvite.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const staffInviteWithIdOnly = await prisma.staffInvite.findMany({ select: { id: true } })
     *
     */
    findMany<T extends StaffInviteFindManyArgs>(args?: Prisma.SelectSubset<T, StaffInviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a StaffInvite.
     * @param {StaffInviteCreateArgs} args - Arguments to create a StaffInvite.
     * @example
     * // Create one StaffInvite
     * const StaffInvite = await prisma.staffInvite.create({
     *   data: {
     *     // ... data to create a StaffInvite
     *   }
     * })
     *
     */
    create<T extends StaffInviteCreateArgs>(args: Prisma.SelectSubset<T, StaffInviteCreateArgs<ExtArgs>>): Prisma.Prisma__StaffInviteClient<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many StaffInvites.
     * @param {StaffInviteCreateManyArgs} args - Arguments to create many StaffInvites.
     * @example
     * // Create many StaffInvites
     * const staffInvite = await prisma.staffInvite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends StaffInviteCreateManyArgs>(args?: Prisma.SelectSubset<T, StaffInviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many StaffInvites and returns the data saved in the database.
     * @param {StaffInviteCreateManyAndReturnArgs} args - Arguments to create many StaffInvites.
     * @example
     * // Create many StaffInvites
     * const staffInvite = await prisma.staffInvite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many StaffInvites and only return the `id`
     * const staffInviteWithIdOnly = await prisma.staffInvite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends StaffInviteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StaffInviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a StaffInvite.
     * @param {StaffInviteDeleteArgs} args - Arguments to delete one StaffInvite.
     * @example
     * // Delete one StaffInvite
     * const StaffInvite = await prisma.staffInvite.delete({
     *   where: {
     *     // ... filter to delete one StaffInvite
     *   }
     * })
     *
     */
    delete<T extends StaffInviteDeleteArgs>(args: Prisma.SelectSubset<T, StaffInviteDeleteArgs<ExtArgs>>): Prisma.Prisma__StaffInviteClient<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one StaffInvite.
     * @param {StaffInviteUpdateArgs} args - Arguments to update one StaffInvite.
     * @example
     * // Update one StaffInvite
     * const staffInvite = await prisma.staffInvite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends StaffInviteUpdateArgs>(args: Prisma.SelectSubset<T, StaffInviteUpdateArgs<ExtArgs>>): Prisma.Prisma__StaffInviteClient<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more StaffInvites.
     * @param {StaffInviteDeleteManyArgs} args - Arguments to filter StaffInvites to delete.
     * @example
     * // Delete a few StaffInvites
     * const { count } = await prisma.staffInvite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends StaffInviteDeleteManyArgs>(args?: Prisma.SelectSubset<T, StaffInviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more StaffInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffInviteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StaffInvites
     * const staffInvite = await prisma.staffInvite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends StaffInviteUpdateManyArgs>(args: Prisma.SelectSubset<T, StaffInviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more StaffInvites and returns the data updated in the database.
     * @param {StaffInviteUpdateManyAndReturnArgs} args - Arguments to update many StaffInvites.
     * @example
     * // Update many StaffInvites
     * const staffInvite = await prisma.staffInvite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more StaffInvites and only return the `id`
     * const staffInviteWithIdOnly = await prisma.staffInvite.updateManyAndReturn({
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
    updateManyAndReturn<T extends StaffInviteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StaffInviteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one StaffInvite.
     * @param {StaffInviteUpsertArgs} args - Arguments to update or create a StaffInvite.
     * @example
     * // Update or create a StaffInvite
     * const staffInvite = await prisma.staffInvite.upsert({
     *   create: {
     *     // ... data to create a StaffInvite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StaffInvite we want to update
     *   }
     * })
     */
    upsert<T extends StaffInviteUpsertArgs>(args: Prisma.SelectSubset<T, StaffInviteUpsertArgs<ExtArgs>>): Prisma.Prisma__StaffInviteClient<runtime.Types.Result.GetResult<Prisma.$StaffInvitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of StaffInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffInviteCountArgs} args - Arguments to filter StaffInvites to count.
     * @example
     * // Count the number of StaffInvites
     * const count = await prisma.staffInvite.count({
     *   where: {
     *     // ... the filter for the StaffInvites we want to count
     *   }
     * })
    **/
    count<T extends StaffInviteCountArgs>(args?: Prisma.Subset<T, StaffInviteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StaffInviteCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a StaffInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffInviteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StaffInviteAggregateArgs>(args: Prisma.Subset<T, StaffInviteAggregateArgs>): Prisma.PrismaPromise<GetStaffInviteAggregateType<T>>;
    /**
     * Group by StaffInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffInviteGroupByArgs} args - Group by arguments.
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
    groupBy<T extends StaffInviteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StaffInviteGroupByArgs['orderBy'];
    } : {
        orderBy?: StaffInviteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StaffInviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStaffInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the StaffInvite model
     */
    readonly fields: StaffInviteFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for StaffInvite.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__StaffInviteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    business<T extends Prisma.BusinessDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BusinessDefaultArgs<ExtArgs>>): Prisma.Prisma__BusinessClient<runtime.Types.Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the StaffInvite model
 */
export interface StaffInviteFieldRefs {
    readonly id: Prisma.FieldRef<"StaffInvite", 'String'>;
    readonly businessId: Prisma.FieldRef<"StaffInvite", 'String'>;
    readonly destination: Prisma.FieldRef<"StaffInvite", 'String'>;
    readonly roleKey: Prisma.FieldRef<"StaffInvite", 'String'>;
    readonly tokenHash: Prisma.FieldRef<"StaffInvite", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"StaffInvite", 'DateTime'>;
    readonly acceptedAt: Prisma.FieldRef<"StaffInvite", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"StaffInvite", 'DateTime'>;
}
/**
 * StaffInvite findUnique
 */
export type StaffInviteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
    /**
     * Filter, which StaffInvite to fetch.
     */
    where: Prisma.StaffInviteWhereUniqueInput;
};
/**
 * StaffInvite findUniqueOrThrow
 */
export type StaffInviteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
    /**
     * Filter, which StaffInvite to fetch.
     */
    where: Prisma.StaffInviteWhereUniqueInput;
};
/**
 * StaffInvite findFirst
 */
export type StaffInviteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
    /**
     * Filter, which StaffInvite to fetch.
     */
    where?: Prisma.StaffInviteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StaffInvites to fetch.
     */
    orderBy?: Prisma.StaffInviteOrderByWithRelationInput | Prisma.StaffInviteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for StaffInvites.
     */
    cursor?: Prisma.StaffInviteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StaffInvites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StaffInvites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of StaffInvites.
     */
    distinct?: Prisma.StaffInviteScalarFieldEnum | Prisma.StaffInviteScalarFieldEnum[];
};
/**
 * StaffInvite findFirstOrThrow
 */
export type StaffInviteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
    /**
     * Filter, which StaffInvite to fetch.
     */
    where?: Prisma.StaffInviteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StaffInvites to fetch.
     */
    orderBy?: Prisma.StaffInviteOrderByWithRelationInput | Prisma.StaffInviteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for StaffInvites.
     */
    cursor?: Prisma.StaffInviteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StaffInvites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StaffInvites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of StaffInvites.
     */
    distinct?: Prisma.StaffInviteScalarFieldEnum | Prisma.StaffInviteScalarFieldEnum[];
};
/**
 * StaffInvite findMany
 */
export type StaffInviteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
    /**
     * Filter, which StaffInvites to fetch.
     */
    where?: Prisma.StaffInviteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StaffInvites to fetch.
     */
    orderBy?: Prisma.StaffInviteOrderByWithRelationInput | Prisma.StaffInviteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing StaffInvites.
     */
    cursor?: Prisma.StaffInviteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StaffInvites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StaffInvites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of StaffInvites.
     */
    distinct?: Prisma.StaffInviteScalarFieldEnum | Prisma.StaffInviteScalarFieldEnum[];
};
/**
 * StaffInvite create
 */
export type StaffInviteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
    /**
     * The data needed to create a StaffInvite.
     */
    data: Prisma.XOR<Prisma.StaffInviteCreateInput, Prisma.StaffInviteUncheckedCreateInput>;
};
/**
 * StaffInvite createMany
 */
export type StaffInviteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many StaffInvites.
     */
    data: Prisma.StaffInviteCreateManyInput | Prisma.StaffInviteCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * StaffInvite createManyAndReturn
 */
export type StaffInviteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * The data used to create many StaffInvites.
     */
    data: Prisma.StaffInviteCreateManyInput | Prisma.StaffInviteCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * StaffInvite update
 */
export type StaffInviteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
    /**
     * The data needed to update a StaffInvite.
     */
    data: Prisma.XOR<Prisma.StaffInviteUpdateInput, Prisma.StaffInviteUncheckedUpdateInput>;
    /**
     * Choose, which StaffInvite to update.
     */
    where: Prisma.StaffInviteWhereUniqueInput;
};
/**
 * StaffInvite updateMany
 */
export type StaffInviteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update StaffInvites.
     */
    data: Prisma.XOR<Prisma.StaffInviteUpdateManyMutationInput, Prisma.StaffInviteUncheckedUpdateManyInput>;
    /**
     * Filter which StaffInvites to update
     */
    where?: Prisma.StaffInviteWhereInput;
    /**
     * Limit how many StaffInvites to update.
     */
    limit?: number;
};
/**
 * StaffInvite updateManyAndReturn
 */
export type StaffInviteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * The data used to update StaffInvites.
     */
    data: Prisma.XOR<Prisma.StaffInviteUpdateManyMutationInput, Prisma.StaffInviteUncheckedUpdateManyInput>;
    /**
     * Filter which StaffInvites to update
     */
    where?: Prisma.StaffInviteWhereInput;
    /**
     * Limit how many StaffInvites to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * StaffInvite upsert
 */
export type StaffInviteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
    /**
     * The filter to search for the StaffInvite to update in case it exists.
     */
    where: Prisma.StaffInviteWhereUniqueInput;
    /**
     * In case the StaffInvite found by the `where` argument doesn't exist, create a new StaffInvite with this data.
     */
    create: Prisma.XOR<Prisma.StaffInviteCreateInput, Prisma.StaffInviteUncheckedCreateInput>;
    /**
     * In case the StaffInvite was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.StaffInviteUpdateInput, Prisma.StaffInviteUncheckedUpdateInput>;
};
/**
 * StaffInvite delete
 */
export type StaffInviteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
    /**
     * Filter which StaffInvite to delete.
     */
    where: Prisma.StaffInviteWhereUniqueInput;
};
/**
 * StaffInvite deleteMany
 */
export type StaffInviteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which StaffInvites to delete
     */
    where?: Prisma.StaffInviteWhereInput;
    /**
     * Limit how many StaffInvites to delete.
     */
    limit?: number;
};
/**
 * StaffInvite without action
 */
export type StaffInviteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffInvite
     */
    select?: Prisma.StaffInviteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the StaffInvite
     */
    omit?: Prisma.StaffInviteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StaffInviteInclude<ExtArgs> | null;
};
//# sourceMappingURL=StaffInvite.d.ts.map