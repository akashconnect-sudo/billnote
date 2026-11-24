import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model TenantMigrationRun
 *
 */
export type TenantMigrationRunModel = runtime.Types.Result.DefaultSelection<Prisma.$TenantMigrationRunPayload>;
export type AggregateTenantMigrationRun = {
    _count: TenantMigrationRunCountAggregateOutputType | null;
    _avg: TenantMigrationRunAvgAggregateOutputType | null;
    _sum: TenantMigrationRunSumAggregateOutputType | null;
    _min: TenantMigrationRunMinAggregateOutputType | null;
    _max: TenantMigrationRunMaxAggregateOutputType | null;
};
export type TenantMigrationRunAvgAggregateOutputType = {
    version: number | null;
};
export type TenantMigrationRunSumAggregateOutputType = {
    version: number | null;
};
export type TenantMigrationRunMinAggregateOutputType = {
    id: string | null;
    businessId: string | null;
    version: number | null;
    checksum: string | null;
    status: string | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    error: string | null;
};
export type TenantMigrationRunMaxAggregateOutputType = {
    id: string | null;
    businessId: string | null;
    version: number | null;
    checksum: string | null;
    status: string | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    error: string | null;
};
export type TenantMigrationRunCountAggregateOutputType = {
    id: number;
    businessId: number;
    version: number;
    checksum: number;
    status: number;
    startedAt: number;
    finishedAt: number;
    error: number;
    _all: number;
};
export type TenantMigrationRunAvgAggregateInputType = {
    version?: true;
};
export type TenantMigrationRunSumAggregateInputType = {
    version?: true;
};
export type TenantMigrationRunMinAggregateInputType = {
    id?: true;
    businessId?: true;
    version?: true;
    checksum?: true;
    status?: true;
    startedAt?: true;
    finishedAt?: true;
    error?: true;
};
export type TenantMigrationRunMaxAggregateInputType = {
    id?: true;
    businessId?: true;
    version?: true;
    checksum?: true;
    status?: true;
    startedAt?: true;
    finishedAt?: true;
    error?: true;
};
export type TenantMigrationRunCountAggregateInputType = {
    id?: true;
    businessId?: true;
    version?: true;
    checksum?: true;
    status?: true;
    startedAt?: true;
    finishedAt?: true;
    error?: true;
    _all?: true;
};
export type TenantMigrationRunAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TenantMigrationRun to aggregate.
     */
    where?: Prisma.TenantMigrationRunWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TenantMigrationRuns to fetch.
     */
    orderBy?: Prisma.TenantMigrationRunOrderByWithRelationInput | Prisma.TenantMigrationRunOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.TenantMigrationRunWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TenantMigrationRuns from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TenantMigrationRuns.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TenantMigrationRuns
    **/
    _count?: true | TenantMigrationRunCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: TenantMigrationRunAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: TenantMigrationRunSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TenantMigrationRunMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TenantMigrationRunMaxAggregateInputType;
};
export type GetTenantMigrationRunAggregateType<T extends TenantMigrationRunAggregateArgs> = {
    [P in keyof T & keyof AggregateTenantMigrationRun]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTenantMigrationRun[P]> : Prisma.GetScalarType<T[P], AggregateTenantMigrationRun[P]>;
};
export type TenantMigrationRunGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantMigrationRunWhereInput;
    orderBy?: Prisma.TenantMigrationRunOrderByWithAggregationInput | Prisma.TenantMigrationRunOrderByWithAggregationInput[];
    by: Prisma.TenantMigrationRunScalarFieldEnum[] | Prisma.TenantMigrationRunScalarFieldEnum;
    having?: Prisma.TenantMigrationRunScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TenantMigrationRunCountAggregateInputType | true;
    _avg?: TenantMigrationRunAvgAggregateInputType;
    _sum?: TenantMigrationRunSumAggregateInputType;
    _min?: TenantMigrationRunMinAggregateInputType;
    _max?: TenantMigrationRunMaxAggregateInputType;
};
export type TenantMigrationRunGroupByOutputType = {
    id: string;
    businessId: string;
    version: number;
    checksum: string;
    status: string;
    startedAt: Date;
    finishedAt: Date | null;
    error: string | null;
    _count: TenantMigrationRunCountAggregateOutputType | null;
    _avg: TenantMigrationRunAvgAggregateOutputType | null;
    _sum: TenantMigrationRunSumAggregateOutputType | null;
    _min: TenantMigrationRunMinAggregateOutputType | null;
    _max: TenantMigrationRunMaxAggregateOutputType | null;
};
export type GetTenantMigrationRunGroupByPayload<T extends TenantMigrationRunGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TenantMigrationRunGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TenantMigrationRunGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TenantMigrationRunGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TenantMigrationRunGroupByOutputType[P]>;
}>>;
export type TenantMigrationRunWhereInput = {
    AND?: Prisma.TenantMigrationRunWhereInput | Prisma.TenantMigrationRunWhereInput[];
    OR?: Prisma.TenantMigrationRunWhereInput[];
    NOT?: Prisma.TenantMigrationRunWhereInput | Prisma.TenantMigrationRunWhereInput[];
    id?: Prisma.UuidFilter<"TenantMigrationRun"> | string;
    businessId?: Prisma.UuidFilter<"TenantMigrationRun"> | string;
    version?: Prisma.IntFilter<"TenantMigrationRun"> | number;
    checksum?: Prisma.StringFilter<"TenantMigrationRun"> | string;
    status?: Prisma.StringFilter<"TenantMigrationRun"> | string;
    startedAt?: Prisma.DateTimeFilter<"TenantMigrationRun"> | Date | string;
    finishedAt?: Prisma.DateTimeNullableFilter<"TenantMigrationRun"> | Date | string | null;
    error?: Prisma.StringNullableFilter<"TenantMigrationRun"> | string | null;
    business?: Prisma.XOR<Prisma.BusinessScalarRelationFilter, Prisma.BusinessWhereInput>;
};
export type TenantMigrationRunOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    checksum?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    error?: Prisma.SortOrderInput | Prisma.SortOrder;
    business?: Prisma.BusinessOrderByWithRelationInput;
};
export type TenantMigrationRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    businessId_version_startedAt?: Prisma.TenantMigrationRunBusinessIdVersionStartedAtCompoundUniqueInput;
    AND?: Prisma.TenantMigrationRunWhereInput | Prisma.TenantMigrationRunWhereInput[];
    OR?: Prisma.TenantMigrationRunWhereInput[];
    NOT?: Prisma.TenantMigrationRunWhereInput | Prisma.TenantMigrationRunWhereInput[];
    businessId?: Prisma.UuidFilter<"TenantMigrationRun"> | string;
    version?: Prisma.IntFilter<"TenantMigrationRun"> | number;
    checksum?: Prisma.StringFilter<"TenantMigrationRun"> | string;
    status?: Prisma.StringFilter<"TenantMigrationRun"> | string;
    startedAt?: Prisma.DateTimeFilter<"TenantMigrationRun"> | Date | string;
    finishedAt?: Prisma.DateTimeNullableFilter<"TenantMigrationRun"> | Date | string | null;
    error?: Prisma.StringNullableFilter<"TenantMigrationRun"> | string | null;
    business?: Prisma.XOR<Prisma.BusinessScalarRelationFilter, Prisma.BusinessWhereInput>;
}, "id" | "businessId_version_startedAt">;
export type TenantMigrationRunOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    checksum?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    error?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TenantMigrationRunCountOrderByAggregateInput;
    _avg?: Prisma.TenantMigrationRunAvgOrderByAggregateInput;
    _max?: Prisma.TenantMigrationRunMaxOrderByAggregateInput;
    _min?: Prisma.TenantMigrationRunMinOrderByAggregateInput;
    _sum?: Prisma.TenantMigrationRunSumOrderByAggregateInput;
};
export type TenantMigrationRunScalarWhereWithAggregatesInput = {
    AND?: Prisma.TenantMigrationRunScalarWhereWithAggregatesInput | Prisma.TenantMigrationRunScalarWhereWithAggregatesInput[];
    OR?: Prisma.TenantMigrationRunScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TenantMigrationRunScalarWhereWithAggregatesInput | Prisma.TenantMigrationRunScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"TenantMigrationRun"> | string;
    businessId?: Prisma.UuidWithAggregatesFilter<"TenantMigrationRun"> | string;
    version?: Prisma.IntWithAggregatesFilter<"TenantMigrationRun"> | number;
    checksum?: Prisma.StringWithAggregatesFilter<"TenantMigrationRun"> | string;
    status?: Prisma.StringWithAggregatesFilter<"TenantMigrationRun"> | string;
    startedAt?: Prisma.DateTimeWithAggregatesFilter<"TenantMigrationRun"> | Date | string;
    finishedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"TenantMigrationRun"> | Date | string | null;
    error?: Prisma.StringNullableWithAggregatesFilter<"TenantMigrationRun"> | string | null;
};
export type TenantMigrationRunCreateInput = {
    id?: string;
    version: number;
    checksum: string;
    status: string;
    startedAt: Date | string;
    finishedAt?: Date | string | null;
    error?: string | null;
    business: Prisma.BusinessCreateNestedOneWithoutMigrationRunsInput;
};
export type TenantMigrationRunUncheckedCreateInput = {
    id?: string;
    businessId: string;
    version: number;
    checksum: string;
    status: string;
    startedAt: Date | string;
    finishedAt?: Date | string | null;
    error?: string | null;
};
export type TenantMigrationRunUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    checksum?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    business?: Prisma.BusinessUpdateOneRequiredWithoutMigrationRunsNestedInput;
};
export type TenantMigrationRunUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    businessId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    checksum?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TenantMigrationRunCreateManyInput = {
    id?: string;
    businessId: string;
    version: number;
    checksum: string;
    status: string;
    startedAt: Date | string;
    finishedAt?: Date | string | null;
    error?: string | null;
};
export type TenantMigrationRunUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    checksum?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TenantMigrationRunUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    businessId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    checksum?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TenantMigrationRunListRelationFilter = {
    every?: Prisma.TenantMigrationRunWhereInput;
    some?: Prisma.TenantMigrationRunWhereInput;
    none?: Prisma.TenantMigrationRunWhereInput;
};
export type TenantMigrationRunOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TenantMigrationRunBusinessIdVersionStartedAtCompoundUniqueInput = {
    businessId: string;
    version: number;
    startedAt: Date | string;
};
export type TenantMigrationRunCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    checksum?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
    error?: Prisma.SortOrder;
};
export type TenantMigrationRunAvgOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type TenantMigrationRunMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    checksum?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
    error?: Prisma.SortOrder;
};
export type TenantMigrationRunMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    businessId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    checksum?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
    error?: Prisma.SortOrder;
};
export type TenantMigrationRunSumOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type TenantMigrationRunCreateNestedManyWithoutBusinessInput = {
    create?: Prisma.XOR<Prisma.TenantMigrationRunCreateWithoutBusinessInput, Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput> | Prisma.TenantMigrationRunCreateWithoutBusinessInput[] | Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput[];
    connectOrCreate?: Prisma.TenantMigrationRunCreateOrConnectWithoutBusinessInput | Prisma.TenantMigrationRunCreateOrConnectWithoutBusinessInput[];
    createMany?: Prisma.TenantMigrationRunCreateManyBusinessInputEnvelope;
    connect?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
};
export type TenantMigrationRunUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: Prisma.XOR<Prisma.TenantMigrationRunCreateWithoutBusinessInput, Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput> | Prisma.TenantMigrationRunCreateWithoutBusinessInput[] | Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput[];
    connectOrCreate?: Prisma.TenantMigrationRunCreateOrConnectWithoutBusinessInput | Prisma.TenantMigrationRunCreateOrConnectWithoutBusinessInput[];
    createMany?: Prisma.TenantMigrationRunCreateManyBusinessInputEnvelope;
    connect?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
};
export type TenantMigrationRunUpdateManyWithoutBusinessNestedInput = {
    create?: Prisma.XOR<Prisma.TenantMigrationRunCreateWithoutBusinessInput, Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput> | Prisma.TenantMigrationRunCreateWithoutBusinessInput[] | Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput[];
    connectOrCreate?: Prisma.TenantMigrationRunCreateOrConnectWithoutBusinessInput | Prisma.TenantMigrationRunCreateOrConnectWithoutBusinessInput[];
    upsert?: Prisma.TenantMigrationRunUpsertWithWhereUniqueWithoutBusinessInput | Prisma.TenantMigrationRunUpsertWithWhereUniqueWithoutBusinessInput[];
    createMany?: Prisma.TenantMigrationRunCreateManyBusinessInputEnvelope;
    set?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
    disconnect?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
    delete?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
    connect?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
    update?: Prisma.TenantMigrationRunUpdateWithWhereUniqueWithoutBusinessInput | Prisma.TenantMigrationRunUpdateWithWhereUniqueWithoutBusinessInput[];
    updateMany?: Prisma.TenantMigrationRunUpdateManyWithWhereWithoutBusinessInput | Prisma.TenantMigrationRunUpdateManyWithWhereWithoutBusinessInput[];
    deleteMany?: Prisma.TenantMigrationRunScalarWhereInput | Prisma.TenantMigrationRunScalarWhereInput[];
};
export type TenantMigrationRunUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: Prisma.XOR<Prisma.TenantMigrationRunCreateWithoutBusinessInput, Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput> | Prisma.TenantMigrationRunCreateWithoutBusinessInput[] | Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput[];
    connectOrCreate?: Prisma.TenantMigrationRunCreateOrConnectWithoutBusinessInput | Prisma.TenantMigrationRunCreateOrConnectWithoutBusinessInput[];
    upsert?: Prisma.TenantMigrationRunUpsertWithWhereUniqueWithoutBusinessInput | Prisma.TenantMigrationRunUpsertWithWhereUniqueWithoutBusinessInput[];
    createMany?: Prisma.TenantMigrationRunCreateManyBusinessInputEnvelope;
    set?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
    disconnect?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
    delete?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
    connect?: Prisma.TenantMigrationRunWhereUniqueInput | Prisma.TenantMigrationRunWhereUniqueInput[];
    update?: Prisma.TenantMigrationRunUpdateWithWhereUniqueWithoutBusinessInput | Prisma.TenantMigrationRunUpdateWithWhereUniqueWithoutBusinessInput[];
    updateMany?: Prisma.TenantMigrationRunUpdateManyWithWhereWithoutBusinessInput | Prisma.TenantMigrationRunUpdateManyWithWhereWithoutBusinessInput[];
    deleteMany?: Prisma.TenantMigrationRunScalarWhereInput | Prisma.TenantMigrationRunScalarWhereInput[];
};
export type TenantMigrationRunCreateWithoutBusinessInput = {
    id?: string;
    version: number;
    checksum: string;
    status: string;
    startedAt: Date | string;
    finishedAt?: Date | string | null;
    error?: string | null;
};
export type TenantMigrationRunUncheckedCreateWithoutBusinessInput = {
    id?: string;
    version: number;
    checksum: string;
    status: string;
    startedAt: Date | string;
    finishedAt?: Date | string | null;
    error?: string | null;
};
export type TenantMigrationRunCreateOrConnectWithoutBusinessInput = {
    where: Prisma.TenantMigrationRunWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantMigrationRunCreateWithoutBusinessInput, Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput>;
};
export type TenantMigrationRunCreateManyBusinessInputEnvelope = {
    data: Prisma.TenantMigrationRunCreateManyBusinessInput | Prisma.TenantMigrationRunCreateManyBusinessInput[];
    skipDuplicates?: boolean;
};
export type TenantMigrationRunUpsertWithWhereUniqueWithoutBusinessInput = {
    where: Prisma.TenantMigrationRunWhereUniqueInput;
    update: Prisma.XOR<Prisma.TenantMigrationRunUpdateWithoutBusinessInput, Prisma.TenantMigrationRunUncheckedUpdateWithoutBusinessInput>;
    create: Prisma.XOR<Prisma.TenantMigrationRunCreateWithoutBusinessInput, Prisma.TenantMigrationRunUncheckedCreateWithoutBusinessInput>;
};
export type TenantMigrationRunUpdateWithWhereUniqueWithoutBusinessInput = {
    where: Prisma.TenantMigrationRunWhereUniqueInput;
    data: Prisma.XOR<Prisma.TenantMigrationRunUpdateWithoutBusinessInput, Prisma.TenantMigrationRunUncheckedUpdateWithoutBusinessInput>;
};
export type TenantMigrationRunUpdateManyWithWhereWithoutBusinessInput = {
    where: Prisma.TenantMigrationRunScalarWhereInput;
    data: Prisma.XOR<Prisma.TenantMigrationRunUpdateManyMutationInput, Prisma.TenantMigrationRunUncheckedUpdateManyWithoutBusinessInput>;
};
export type TenantMigrationRunScalarWhereInput = {
    AND?: Prisma.TenantMigrationRunScalarWhereInput | Prisma.TenantMigrationRunScalarWhereInput[];
    OR?: Prisma.TenantMigrationRunScalarWhereInput[];
    NOT?: Prisma.TenantMigrationRunScalarWhereInput | Prisma.TenantMigrationRunScalarWhereInput[];
    id?: Prisma.UuidFilter<"TenantMigrationRun"> | string;
    businessId?: Prisma.UuidFilter<"TenantMigrationRun"> | string;
    version?: Prisma.IntFilter<"TenantMigrationRun"> | number;
    checksum?: Prisma.StringFilter<"TenantMigrationRun"> | string;
    status?: Prisma.StringFilter<"TenantMigrationRun"> | string;
    startedAt?: Prisma.DateTimeFilter<"TenantMigrationRun"> | Date | string;
    finishedAt?: Prisma.DateTimeNullableFilter<"TenantMigrationRun"> | Date | string | null;
    error?: Prisma.StringNullableFilter<"TenantMigrationRun"> | string | null;
};
export type TenantMigrationRunCreateManyBusinessInput = {
    id?: string;
    version: number;
    checksum: string;
    status: string;
    startedAt: Date | string;
    finishedAt?: Date | string | null;
    error?: string | null;
};
export type TenantMigrationRunUpdateWithoutBusinessInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    checksum?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TenantMigrationRunUncheckedUpdateWithoutBusinessInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    checksum?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TenantMigrationRunUncheckedUpdateManyWithoutBusinessInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    checksum?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TenantMigrationRunSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    businessId?: boolean;
    version?: boolean;
    checksum?: boolean;
    status?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    error?: boolean;
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenantMigrationRun"]>;
export type TenantMigrationRunSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    businessId?: boolean;
    version?: boolean;
    checksum?: boolean;
    status?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    error?: boolean;
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenantMigrationRun"]>;
export type TenantMigrationRunSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    businessId?: boolean;
    version?: boolean;
    checksum?: boolean;
    status?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    error?: boolean;
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenantMigrationRun"]>;
export type TenantMigrationRunSelectScalar = {
    id?: boolean;
    businessId?: boolean;
    version?: boolean;
    checksum?: boolean;
    status?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    error?: boolean;
};
export type TenantMigrationRunOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "businessId" | "version" | "checksum" | "status" | "startedAt" | "finishedAt" | "error", ExtArgs["result"]["tenantMigrationRun"]>;
export type TenantMigrationRunInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
};
export type TenantMigrationRunIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
};
export type TenantMigrationRunIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    business?: boolean | Prisma.BusinessDefaultArgs<ExtArgs>;
};
export type $TenantMigrationRunPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TenantMigrationRun";
    objects: {
        business: Prisma.$BusinessPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        businessId: string;
        version: number;
        checksum: string;
        status: string;
        startedAt: Date;
        finishedAt: Date | null;
        error: string | null;
    }, ExtArgs["result"]["tenantMigrationRun"]>;
    composites: {};
};
export type TenantMigrationRunGetPayload<S extends boolean | null | undefined | TenantMigrationRunDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload, S>;
export type TenantMigrationRunCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TenantMigrationRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TenantMigrationRunCountAggregateInputType | true;
};
export interface TenantMigrationRunDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TenantMigrationRun'];
        meta: {
            name: 'TenantMigrationRun';
        };
    };
    /**
     * Find zero or one TenantMigrationRun that matches the filter.
     * @param {TenantMigrationRunFindUniqueArgs} args - Arguments to find a TenantMigrationRun
     * @example
     * // Get one TenantMigrationRun
     * const tenantMigrationRun = await prisma.tenantMigrationRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantMigrationRunFindUniqueArgs>(args: Prisma.SelectSubset<T, TenantMigrationRunFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TenantMigrationRunClient<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one TenantMigrationRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantMigrationRunFindUniqueOrThrowArgs} args - Arguments to find a TenantMigrationRun
     * @example
     * // Get one TenantMigrationRun
     * const tenantMigrationRun = await prisma.tenantMigrationRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantMigrationRunFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TenantMigrationRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantMigrationRunClient<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TenantMigrationRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMigrationRunFindFirstArgs} args - Arguments to find a TenantMigrationRun
     * @example
     * // Get one TenantMigrationRun
     * const tenantMigrationRun = await prisma.tenantMigrationRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantMigrationRunFindFirstArgs>(args?: Prisma.SelectSubset<T, TenantMigrationRunFindFirstArgs<ExtArgs>>): Prisma.Prisma__TenantMigrationRunClient<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TenantMigrationRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMigrationRunFindFirstOrThrowArgs} args - Arguments to find a TenantMigrationRun
     * @example
     * // Get one TenantMigrationRun
     * const tenantMigrationRun = await prisma.tenantMigrationRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantMigrationRunFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TenantMigrationRunFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantMigrationRunClient<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more TenantMigrationRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMigrationRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantMigrationRuns
     * const tenantMigrationRuns = await prisma.tenantMigrationRun.findMany()
     *
     * // Get first 10 TenantMigrationRuns
     * const tenantMigrationRuns = await prisma.tenantMigrationRun.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tenantMigrationRunWithIdOnly = await prisma.tenantMigrationRun.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TenantMigrationRunFindManyArgs>(args?: Prisma.SelectSubset<T, TenantMigrationRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a TenantMigrationRun.
     * @param {TenantMigrationRunCreateArgs} args - Arguments to create a TenantMigrationRun.
     * @example
     * // Create one TenantMigrationRun
     * const TenantMigrationRun = await prisma.tenantMigrationRun.create({
     *   data: {
     *     // ... data to create a TenantMigrationRun
     *   }
     * })
     *
     */
    create<T extends TenantMigrationRunCreateArgs>(args: Prisma.SelectSubset<T, TenantMigrationRunCreateArgs<ExtArgs>>): Prisma.Prisma__TenantMigrationRunClient<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many TenantMigrationRuns.
     * @param {TenantMigrationRunCreateManyArgs} args - Arguments to create many TenantMigrationRuns.
     * @example
     * // Create many TenantMigrationRuns
     * const tenantMigrationRun = await prisma.tenantMigrationRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TenantMigrationRunCreateManyArgs>(args?: Prisma.SelectSubset<T, TenantMigrationRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many TenantMigrationRuns and returns the data saved in the database.
     * @param {TenantMigrationRunCreateManyAndReturnArgs} args - Arguments to create many TenantMigrationRuns.
     * @example
     * // Create many TenantMigrationRuns
     * const tenantMigrationRun = await prisma.tenantMigrationRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many TenantMigrationRuns and only return the `id`
     * const tenantMigrationRunWithIdOnly = await prisma.tenantMigrationRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TenantMigrationRunCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TenantMigrationRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a TenantMigrationRun.
     * @param {TenantMigrationRunDeleteArgs} args - Arguments to delete one TenantMigrationRun.
     * @example
     * // Delete one TenantMigrationRun
     * const TenantMigrationRun = await prisma.tenantMigrationRun.delete({
     *   where: {
     *     // ... filter to delete one TenantMigrationRun
     *   }
     * })
     *
     */
    delete<T extends TenantMigrationRunDeleteArgs>(args: Prisma.SelectSubset<T, TenantMigrationRunDeleteArgs<ExtArgs>>): Prisma.Prisma__TenantMigrationRunClient<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one TenantMigrationRun.
     * @param {TenantMigrationRunUpdateArgs} args - Arguments to update one TenantMigrationRun.
     * @example
     * // Update one TenantMigrationRun
     * const tenantMigrationRun = await prisma.tenantMigrationRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TenantMigrationRunUpdateArgs>(args: Prisma.SelectSubset<T, TenantMigrationRunUpdateArgs<ExtArgs>>): Prisma.Prisma__TenantMigrationRunClient<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more TenantMigrationRuns.
     * @param {TenantMigrationRunDeleteManyArgs} args - Arguments to filter TenantMigrationRuns to delete.
     * @example
     * // Delete a few TenantMigrationRuns
     * const { count } = await prisma.tenantMigrationRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TenantMigrationRunDeleteManyArgs>(args?: Prisma.SelectSubset<T, TenantMigrationRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more TenantMigrationRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMigrationRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantMigrationRuns
     * const tenantMigrationRun = await prisma.tenantMigrationRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TenantMigrationRunUpdateManyArgs>(args: Prisma.SelectSubset<T, TenantMigrationRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more TenantMigrationRuns and returns the data updated in the database.
     * @param {TenantMigrationRunUpdateManyAndReturnArgs} args - Arguments to update many TenantMigrationRuns.
     * @example
     * // Update many TenantMigrationRuns
     * const tenantMigrationRun = await prisma.tenantMigrationRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more TenantMigrationRuns and only return the `id`
     * const tenantMigrationRunWithIdOnly = await prisma.tenantMigrationRun.updateManyAndReturn({
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
    updateManyAndReturn<T extends TenantMigrationRunUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TenantMigrationRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one TenantMigrationRun.
     * @param {TenantMigrationRunUpsertArgs} args - Arguments to update or create a TenantMigrationRun.
     * @example
     * // Update or create a TenantMigrationRun
     * const tenantMigrationRun = await prisma.tenantMigrationRun.upsert({
     *   create: {
     *     // ... data to create a TenantMigrationRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantMigrationRun we want to update
     *   }
     * })
     */
    upsert<T extends TenantMigrationRunUpsertArgs>(args: Prisma.SelectSubset<T, TenantMigrationRunUpsertArgs<ExtArgs>>): Prisma.Prisma__TenantMigrationRunClient<runtime.Types.Result.GetResult<Prisma.$TenantMigrationRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of TenantMigrationRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMigrationRunCountArgs} args - Arguments to filter TenantMigrationRuns to count.
     * @example
     * // Count the number of TenantMigrationRuns
     * const count = await prisma.tenantMigrationRun.count({
     *   where: {
     *     // ... the filter for the TenantMigrationRuns we want to count
     *   }
     * })
    **/
    count<T extends TenantMigrationRunCountArgs>(args?: Prisma.Subset<T, TenantMigrationRunCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TenantMigrationRunCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a TenantMigrationRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMigrationRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TenantMigrationRunAggregateArgs>(args: Prisma.Subset<T, TenantMigrationRunAggregateArgs>): Prisma.PrismaPromise<GetTenantMigrationRunAggregateType<T>>;
    /**
     * Group by TenantMigrationRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMigrationRunGroupByArgs} args - Group by arguments.
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
    groupBy<T extends TenantMigrationRunGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TenantMigrationRunGroupByArgs['orderBy'];
    } : {
        orderBy?: TenantMigrationRunGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TenantMigrationRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantMigrationRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the TenantMigrationRun model
     */
    readonly fields: TenantMigrationRunFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for TenantMigrationRun.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__TenantMigrationRunClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the TenantMigrationRun model
 */
export interface TenantMigrationRunFieldRefs {
    readonly id: Prisma.FieldRef<"TenantMigrationRun", 'String'>;
    readonly businessId: Prisma.FieldRef<"TenantMigrationRun", 'String'>;
    readonly version: Prisma.FieldRef<"TenantMigrationRun", 'Int'>;
    readonly checksum: Prisma.FieldRef<"TenantMigrationRun", 'String'>;
    readonly status: Prisma.FieldRef<"TenantMigrationRun", 'String'>;
    readonly startedAt: Prisma.FieldRef<"TenantMigrationRun", 'DateTime'>;
    readonly finishedAt: Prisma.FieldRef<"TenantMigrationRun", 'DateTime'>;
    readonly error: Prisma.FieldRef<"TenantMigrationRun", 'String'>;
}
/**
 * TenantMigrationRun findUnique
 */
export type TenantMigrationRunFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
    /**
     * Filter, which TenantMigrationRun to fetch.
     */
    where: Prisma.TenantMigrationRunWhereUniqueInput;
};
/**
 * TenantMigrationRun findUniqueOrThrow
 */
export type TenantMigrationRunFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
    /**
     * Filter, which TenantMigrationRun to fetch.
     */
    where: Prisma.TenantMigrationRunWhereUniqueInput;
};
/**
 * TenantMigrationRun findFirst
 */
export type TenantMigrationRunFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
    /**
     * Filter, which TenantMigrationRun to fetch.
     */
    where?: Prisma.TenantMigrationRunWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TenantMigrationRuns to fetch.
     */
    orderBy?: Prisma.TenantMigrationRunOrderByWithRelationInput | Prisma.TenantMigrationRunOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TenantMigrationRuns.
     */
    cursor?: Prisma.TenantMigrationRunWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TenantMigrationRuns from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TenantMigrationRuns.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TenantMigrationRuns.
     */
    distinct?: Prisma.TenantMigrationRunScalarFieldEnum | Prisma.TenantMigrationRunScalarFieldEnum[];
};
/**
 * TenantMigrationRun findFirstOrThrow
 */
export type TenantMigrationRunFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
    /**
     * Filter, which TenantMigrationRun to fetch.
     */
    where?: Prisma.TenantMigrationRunWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TenantMigrationRuns to fetch.
     */
    orderBy?: Prisma.TenantMigrationRunOrderByWithRelationInput | Prisma.TenantMigrationRunOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TenantMigrationRuns.
     */
    cursor?: Prisma.TenantMigrationRunWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TenantMigrationRuns from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TenantMigrationRuns.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TenantMigrationRuns.
     */
    distinct?: Prisma.TenantMigrationRunScalarFieldEnum | Prisma.TenantMigrationRunScalarFieldEnum[];
};
/**
 * TenantMigrationRun findMany
 */
export type TenantMigrationRunFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
    /**
     * Filter, which TenantMigrationRuns to fetch.
     */
    where?: Prisma.TenantMigrationRunWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TenantMigrationRuns to fetch.
     */
    orderBy?: Prisma.TenantMigrationRunOrderByWithRelationInput | Prisma.TenantMigrationRunOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TenantMigrationRuns.
     */
    cursor?: Prisma.TenantMigrationRunWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TenantMigrationRuns from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TenantMigrationRuns.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TenantMigrationRuns.
     */
    distinct?: Prisma.TenantMigrationRunScalarFieldEnum | Prisma.TenantMigrationRunScalarFieldEnum[];
};
/**
 * TenantMigrationRun create
 */
export type TenantMigrationRunCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
    /**
     * The data needed to create a TenantMigrationRun.
     */
    data: Prisma.XOR<Prisma.TenantMigrationRunCreateInput, Prisma.TenantMigrationRunUncheckedCreateInput>;
};
/**
 * TenantMigrationRun createMany
 */
export type TenantMigrationRunCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantMigrationRuns.
     */
    data: Prisma.TenantMigrationRunCreateManyInput | Prisma.TenantMigrationRunCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * TenantMigrationRun createManyAndReturn
 */
export type TenantMigrationRunCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * The data used to create many TenantMigrationRuns.
     */
    data: Prisma.TenantMigrationRunCreateManyInput | Prisma.TenantMigrationRunCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * TenantMigrationRun update
 */
export type TenantMigrationRunUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
    /**
     * The data needed to update a TenantMigrationRun.
     */
    data: Prisma.XOR<Prisma.TenantMigrationRunUpdateInput, Prisma.TenantMigrationRunUncheckedUpdateInput>;
    /**
     * Choose, which TenantMigrationRun to update.
     */
    where: Prisma.TenantMigrationRunWhereUniqueInput;
};
/**
 * TenantMigrationRun updateMany
 */
export type TenantMigrationRunUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantMigrationRuns.
     */
    data: Prisma.XOR<Prisma.TenantMigrationRunUpdateManyMutationInput, Prisma.TenantMigrationRunUncheckedUpdateManyInput>;
    /**
     * Filter which TenantMigrationRuns to update
     */
    where?: Prisma.TenantMigrationRunWhereInput;
    /**
     * Limit how many TenantMigrationRuns to update.
     */
    limit?: number;
};
/**
 * TenantMigrationRun updateManyAndReturn
 */
export type TenantMigrationRunUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * The data used to update TenantMigrationRuns.
     */
    data: Prisma.XOR<Prisma.TenantMigrationRunUpdateManyMutationInput, Prisma.TenantMigrationRunUncheckedUpdateManyInput>;
    /**
     * Filter which TenantMigrationRuns to update
     */
    where?: Prisma.TenantMigrationRunWhereInput;
    /**
     * Limit how many TenantMigrationRuns to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * TenantMigrationRun upsert
 */
export type TenantMigrationRunUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
    /**
     * The filter to search for the TenantMigrationRun to update in case it exists.
     */
    where: Prisma.TenantMigrationRunWhereUniqueInput;
    /**
     * In case the TenantMigrationRun found by the `where` argument doesn't exist, create a new TenantMigrationRun with this data.
     */
    create: Prisma.XOR<Prisma.TenantMigrationRunCreateInput, Prisma.TenantMigrationRunUncheckedCreateInput>;
    /**
     * In case the TenantMigrationRun was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.TenantMigrationRunUpdateInput, Prisma.TenantMigrationRunUncheckedUpdateInput>;
};
/**
 * TenantMigrationRun delete
 */
export type TenantMigrationRunDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
    /**
     * Filter which TenantMigrationRun to delete.
     */
    where: Prisma.TenantMigrationRunWhereUniqueInput;
};
/**
 * TenantMigrationRun deleteMany
 */
export type TenantMigrationRunDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TenantMigrationRuns to delete
     */
    where?: Prisma.TenantMigrationRunWhereInput;
    /**
     * Limit how many TenantMigrationRuns to delete.
     */
    limit?: number;
};
/**
 * TenantMigrationRun without action
 */
export type TenantMigrationRunDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMigrationRun
     */
    select?: Prisma.TenantMigrationRunSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TenantMigrationRun
     */
    omit?: Prisma.TenantMigrationRunOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TenantMigrationRunInclude<ExtArgs> | null;
};
//# sourceMappingURL=TenantMigrationRun.d.ts.map