import * as eu from "@fst/express-utils"
import * as z from "zod"

export type Cluster_Route_Schema = {
    readonly url?: z.ZodType
    readonly body?: z.ZodType
    readonly query?: z.ZodType
    readonly files?: z.ZodType
}

export type Cluster_Route_Handler = eu.Route<any>

export type Cluster_Route = {
    readonly schema: Cluster_Route_Schema
    readonly handler: Cluster_Route_Handler
}

export type Cluster_Routes = {
    readonly [K in string]: Cluster_Route
}

export type Cluster = {
    readonly routes: Cluster_Routes
}

export type Cluster_Schema<Src extends Cluster, Route extends keyof Src["routes"], Key extends keyof Src["routes"][Route]["schema"]> = (
    z.infer<Src["routes"][Route]["schema"][Key]>
)

export type Cluster_Result<Src extends Cluster, Route extends keyof Src["routes"]> = (
    eu.Route_InferBody<Src["routes"][Route]["handler"]>
)
